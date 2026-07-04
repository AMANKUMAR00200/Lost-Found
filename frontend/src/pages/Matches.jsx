import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import {
  Search,
  Trophy,
  MessageCircle,
  Eye,
  MapPin,
  Calendar,
  Filter,
  Sparkles,
} from "lucide-react";

function Matches() {
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);

      const res = await api.get("/matches");

      setMatches(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = matches.filter((match) => {
    const keyword = search.trim().toLowerCase();

    const text = `
      ${match.lost.title || ""}
      ${match.found.title || ""}
      ${match.lost.description || ""}
      ${match.found.description || ""}
      ${match.lost.location || ""}
      ${match.found.location || ""}
    `.toLowerCase();

    const searchMatch = text.includes(keyword);

    let scoreMatch = true;

    if (filter === "high") scoreMatch = match.score >= 80;

    if (filter === "medium") scoreMatch = match.score >= 60 && match.score < 80;

    if (filter === "low") scoreMatch = match.score < 60;

    return searchMatch && scoreMatch;
  });

  return (
    <div className="min-h-screen bg-slate-100">
      {/* HERO */}

      <div className="bg-gradient-to-r from-green-700 via-emerald-600 to-green-500 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div>
              <h1 className="text-5xl font-extrabold">🧠 Smart Matches</h1>

              <p className="mt-3 text-green-100 text-lg">
                AI Powered Lost & Found Matching System
              </p>
            </div>

            {/* Stats */}

            <div className="grid grid-cols-3 gap-5">
              <div className="bg-white/20 backdrop-blur rounded-2xl p-5 text-center">
                <h2 className="text-3xl font-bold">{matches.length}</h2>

                <p>Total</p>
              </div>

              <div className="bg-white/20 backdrop-blur rounded-2xl p-5 text-center">
                <h2 className="text-3xl font-bold">
                  {matches.filter((m) => m.score >= 80).length}
                </h2>

                <p>High</p>
              </div>

              <div className="bg-white/20 backdrop-blur rounded-2xl p-5 text-center">
                <h2 className="text-3xl font-bold">
                  {matches.filter((m) => m.score >= 60).length}
                </h2>

                <p>Possible</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH */}

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                size={20}
                className="absolute left-4 top-4 text-gray-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, location, description..."
                className="w-full border rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={20} />

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border rounded-2xl px-5 py-4"
              >
                <option value="all">All Matches</option>

                <option value="high">High Match</option>

                <option value="medium">Medium Match</option>

                <option value="low">Low Match</option>
              </select>
            </div>
          </div>
        </div>

        {/* MATCH GRID STARTS BELOW */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mx-auto"></div>

            <p className="mt-6 text-gray-500 text-lg">
              Finding Smart Matches...
            </p>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-16 text-center">
            <Sparkles size={60} className="mx-auto text-yellow-500" />

            <h2 className="text-3xl font-bold mt-6">No Matches Found</h2>

            <p className="text-gray-500 mt-3">
              Try another keyword or wait for new reports.
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredMatches.map((match, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 duration-300"
              >
                {/* SCORE */}

                <div
                  className={`p-6 text-white ${
                    match.score >= 80
                      ? "bg-green-600"
                      : match.score >= 60
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold">🎯 {match.score}%</h2>

                    <span className="bg-white text-black px-4 py-2 rounded-full font-semibold">
                      {match.score >= 90
                        ? "Excellent"
                        : match.score >= 75
                          ? "High"
                          : match.score >= 60
                            ? "Medium"
                            : "Low"}
                    </span>
                  </div>

                  {/* Progress */}

                  <div className="mt-5 h-3 bg-white/30 rounded-full">
                    <div
                      className="bg-white h-3 rounded-full duration-700"
                      style={{
                        width: `${match.score}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="p-6">
                  {/* WHY */}

                  <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                    <h3 className="font-bold text-green-700 mb-3">
                      🧠 Why This Matched?
                    </h3>

                    <div className="space-y-2">
                      {match.reasons.map((reason, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-sm"
                        >
                          ✅ {reason}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* LOST */}

                  <div className="mt-8">
                    <h2 className="text-red-600 font-bold text-xl mb-4">
                      🔴 Lost Item
                    </h2>

                    {match.lost.image_url && (
                      <img
                        src={match.lost.image_url}
                        alt=""
                        className="w-full h-56 rounded-2xl object-cover mb-4"
                      />
                    )}

                    <h3 className="text-xl font-bold">{match.lost.title}</h3>

                    <p className="text-gray-600 mt-2">
                      {match.lost.description}
                    </p>

                    <div className="flex items-center gap-2 mt-4">
                      <MapPin size={18} />

                      {match.lost.location}
                    </div>
                  </div>

                  <hr className="my-8" />

                  {/* FOUND */}

                  <div>
                    <h2 className="text-green-600 font-bold text-xl mb-4">
                      🟢 Found Item
                    </h2>

                    {match.found.image_url && (
                      <img
                        src={match.found.image_url}
                        alt=""
                        className="w-full h-56 rounded-2xl object-cover mb-4"
                      />
                    )}

                    <h3 className="text-xl font-bold">{match.found.title}</h3>

                    <p className="text-gray-600 mt-2">
                      {match.found.description}
                    </p>

                    <div className="flex items-center gap-2 mt-4">
                      <MapPin size={18} />

                      {match.found.location}
                    </div>
                  </div>
                  {/* Confidence */}

                  <div className="mt-8">
                    <div
                      className={`rounded-2xl p-5 ${
                        match.score >= 90
                          ? "bg-green-100"
                          : match.score >= 75
                            ? "bg-yellow-100"
                            : "bg-red-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Trophy size={24} className="text-yellow-600" />

                        <div>
                          <h3 className="font-bold text-lg">
                            {match.score >= 90
                              ? "🔥 Excellent Match"
                              : match.score >= 75
                                ? "🟢 High Confidence"
                                : match.score >= 60
                                  ? "🟡 Medium Confidence"
                                  : "🔴 Low Confidence"}
                          </h3>

                          <p className="text-sm text-gray-600 mt-1">
                            AI compared title, description, location and
                            available details.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dates */}

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={18} />

                      <span>
                        {match.lost.created_at
                          ? new Date(match.lost.created_at).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={18} />

                      <span>
                        {match.found.created_at
                          ? new Date(
                              match.found.created_at,
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Buttons */}

                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <button
                      onClick={() => navigate(`/items/${match.found.id}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-3 flex justify-center items-center gap-2 transition"
                    >
                      <Eye size={20} />
                      View Item
                    </button>

                    <button
                      onClick={() => navigate(`/chat/${match.found.user_id}`)}
                      className="bg-green-600 hover:bg-green-700 text-white rounded-2xl py-3 flex justify-center items-center gap-2 transition"
                    >
                      <MessageCircle size={20} />
                      Chat Owner
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Matches;
