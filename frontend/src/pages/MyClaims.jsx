import { useEffect, useState } from "react";
import api from "../services/api";

function MyClaims() {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/claims/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setClaims(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <h1 className="text-4xl font-bold mb-8">
        📩 My Claims
      </h1>

      {claims.length === 0 ? (
        <p>No Claims Yet.</p>
      ) : (
        claims.map((claim) => (
          <div
            key={claim.id}
            className="bg-white rounded-xl shadow-md p-6 mb-5"
          >
            <h2 className="text-2xl font-bold">
              {claim.title}
            </h2>

            <p className="mt-2">
              <strong>Type:</strong> {claim.type}
            </p>

            <p className="mt-2">
              <strong>Location:</strong> {claim.location}
            </p>

            <p className="mt-2">
              <strong>Status:</strong>

              <span
                className={`ml-2 px-3 py-1 rounded-full text-sm ${
                  claim.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : claim.status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {claim.status.toUpperCase()}
              </span>
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default MyClaims;