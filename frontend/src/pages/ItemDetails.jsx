import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import MainLayout from "../layouts/MainLayout";

function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);

  useEffect(() => {
    loadItem();
  }, []);

  const loadItem = async () => {
    try {
      const res = await api.get(`/items/${id}`);
      setItem(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!item) {
    return (
      <MainLayout>
        <div className="text-center mt-20">
          Loading...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto p-6">

        <button
          onClick={() => navigate(-1)}
          className="mb-6 bg-gray-200 px-4 py-2 rounded-lg"
        >
          ← Back
        </button>

        <div className="grid md:grid-cols-2 gap-10">

          <div>

            <img
              src={
                item.image_url ||
                "https://placehold.co/600x450?text=No+Image"
              }
              alt={item.title}
              className="w-full rounded-2xl shadow-lg"
            />

          </div>

          <div>

            <span
              className={`px-3 py-1 rounded-full text-white ${
                item.type === "lost"
                  ? "bg-red-500"
                  : "bg-green-500"
              }`}
            >
              {item.type.toUpperCase()}
            </span>

            <h1 className="text-4xl font-bold mt-4">
              {item.title}
            </h1>

            <p className="text-gray-600 mt-5">
              {item.description}
            </p>

            <div className="mt-6 space-y-3">

              <p>
                📍 <b>Location:</b> {item.location}
              </p>

              <p>
                📅 <b>Status:</b> {item.status}
              </p>

              <p>
                👤 <b>Owner:</b> {item.name}
              </p>

              <p>
                📧 <b>Email:</b> {item.email}
              </p>

            </div>

            <div className="flex gap-4 mt-8">

              <button
                onClick={() => navigate(`/chat/${item.user_id}`)}
                className="bg-green-600 text-white px-6 py-3 rounded-xl"
              >
                💬 Chat Owner
              </button>

              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-xl"
              >
                ❤️ Claim Item
              </button>

            </div>

          </div>

        </div>

      </div>
    </MainLayout>
  );
}

export default ItemDetails;