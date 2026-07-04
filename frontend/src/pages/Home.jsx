import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { useSearch } from "../context/SearchContext";
import { io } from "socket.io-client";
import { useRef } from "react";



import HeroSection from "../components/HeroSection";
import MainLayout from "../layouts/MainLayout";
import StatsCard from "../components/StatsCard";
import ItemCard from "../components/ItemCard";
import FloatingButton from "../components/FloatingButton";

function Home() {
  useEffect(() => {
  fetchItems();
  fetchChatList();

  socketRef.current = io("http://localhost:8000");

  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    socketRef.current.emit("join", user.id);
  }

  socketRef.current.on("receive_message", () => {
    fetchChatList();
  });

  return () => {
    socketRef.current.disconnect();
  };
}, []);

  const navigate = useNavigate();
  const socketRef = useRef(null);

  const [items, setItems] = useState([]);
  const { search, filter } = useSearch();

  const [chatList, setChatList] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [editingId, setEditingId] = useState(null);

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    location: "",
    status: "open",
  });

  const fetchItems = async () => {
    try {
      const res = await api.get("/items");
      setItems(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteItem = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Item deleted successfully");

      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const claimItem = async (itemId) => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/claims",
        {
          itemId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Claim request sent");
    } catch (err) {
      toast.error(err.response?.data?.message || "Claim failed");
    }
  };
  const startEdit = (item) => {
    setEditingId(item.id);

    setEditForm({
      title: item.title,
      description: item.description,
      location: item.location,
      status: item.status,
    });
  };

  const updateItem = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.put(`/items/${editingId}`, editForm, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Item updated successfully");

      setEditingId(null);

      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const fetchChatList = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/messages/chat-list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Chat List:", res.data);

      setChatList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const totalItems = items.length;

  const lostItems = items.filter((item) => item.type === "lost").length;

  const foundItems = items.filter((item) => item.type === "found").length;

  const resolvedItems = items.filter(
    (item) => item.status === "resolved",
  ).length;

  const filteredItems = items.filter((item) => {
    const keyword = search.trim().toLowerCase();

    if (keyword === "") {
      return filter === "all" || item.type === filter;
    }

    const searchableText = `
    ${item.title || ""}
    ${item.description || ""}
    ${item.location || ""}
    ${item.contact_number || ""}
    ${item.type || ""}
  `
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

    const matchesSearch = searchableText.includes(keyword);

    const matchesType = filter === "all" || item.type === filter;

    return matchesSearch && matchesType;
  });

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-100 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Items"
              value={totalItems}
              icon="📦"
              color="bg-blue-100"
              subtitle="All reports"
            />

            <StatsCard
              title="Lost Items"
              value={lostItems}
              icon="🔴"
              color="bg-red-100"
              subtitle="Need attention"
            />

            <StatsCard
              title="Found Items"
              value={foundItems}
              icon="🟢"
              color="bg-green-100"
              subtitle="Waiting for owner"
            />

            <StatsCard
              title="Resolved"
              value={resolvedItems}
              icon="✅"
              color="bg-emerald-100"
              subtitle="Successfully returned"
            />
          </div>

          {/* Header */}
          <HeroSection user={currentUser} />
          <div className="h-8"></div>

          

          {/* Latest Reports */}

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">📦 Latest Reports</h2>

            <span className="text-gray-500">
              Showing {filteredItems.length} Items
            </span>
          </div>

          {items.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-500">
              No items found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  currentUser={currentUser}
                  startEdit={startEdit}
                  deleteItem={deleteItem}
                  claimItem={claimItem}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <FloatingButton
        onClick={() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
      />
    </MainLayout>
  );
}

export default Home;
