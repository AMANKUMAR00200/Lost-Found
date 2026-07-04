import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Phone,
  Gift,
  MessageCircle,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

function ItemCard({ item, currentUser, startEdit, deleteItem, claimItem }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/items/${item.id}`)}
      className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border"
    >
      {/* ================= IMAGE ================= */}

      <div className="relative h-64 bg-gray-100 overflow-hidden">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover hover:scale-110 duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
            <span className="text-7xl">📦</span>

            <p className="text-gray-500 mt-3">No Image</p>
          </div>
        )}

        {/* Badge */}

        <div className="absolute top-4 left-4">
          <span
            className={`px-4 py-2 rounded-full text-xs font-bold shadow ${
              item.type === "lost"
                ? "bg-red-500 text-white"
                : "bg-green-600 text-white"
            }`}
          >
            {item.type === "lost" ? "🔴 LOST" : "🟢 FOUND"}
          </span>
        </div>
      </div>

      {/* ================= BODY ================= */}

      <div className="p-5">
        <h2 className="text-xl font-bold">{item.title}</h2>

        <p className="text-sm text-gray-500 mt-1">
          Posted by{" "}
          <span className="font-semibold">
            {item.name || "Anonymous"}
          </span>
        </p>

        <p className="text-gray-600 mt-3 line-clamp-2">
          {item.description}
        </p>

        {/* Details */}

        <div className="mt-5 space-y-3 text-sm">

          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-green-600" />
            <span>{item.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-blue-600" />

            <span>
              {item.created_at
                ? new Date(item.created_at).toLocaleDateString()
                : "N/A"}
            </span>
          </div>

          {item.contact_number && (
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-red-500" />

              <span>{item.contact_number}</span>
            </div>
          )}

          {item.reward && (
            <div className="flex items-center gap-2">
              <Gift size={16} className="text-yellow-500" />

              <span className="font-semibold text-green-600">
                ₹ {item.reward}
              </span>
            </div>
          )}
        </div>

        {/* ================= BUTTONS ================= */}

        <div className="mt-6 flex flex-wrap gap-3">

          {currentUser.role === "admin" ||
          currentUser.id === item.user_id ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startEdit(item);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl transition"
              >
                <Pencil size={18} />
                Edit
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteItem(item.id);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl transition"
              >
                <Trash2 size={18} />
                Delete
              </button>
            </>
          ) : (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  claimItem(item.id);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition"
              >
                <Eye size={18} />
                Claim
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/chat/${item.user_id}`);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl transition"
              >
                <MessageCircle size={18} />
                Chat
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemCard;