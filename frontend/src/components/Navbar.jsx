import { Link, useNavigate } from "react-router-dom";
import { Bell, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import api from "../services/api";
import { useSearch } from "../context/SearchContext";

function Navbar() {
  const navigate = useNavigate();
  const { search, setSearch, filter, setFilter } = useSearch();

  const user = JSON.parse(localStorage.getItem("user"));
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    loadNotifications();

    const socket = io("http://localhost:8000");

    socket.emit("join", user.id);

    socket.on("new_notification", () => {
      setNotificationCount((prev) => prev + 1);
    });

    return () => socket.disconnect();
  }, []);

  const loadNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(res.data);

      const unread = res.data.filter((n) => !n.is_read);

      setNotificationCount(unread.length);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      {/* Desktop Navbar */}
      <div className="hidden md:flex h-16 px-6 items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/dashboard" className="text-2xl font-bold text-green-600">
          Lost&Found
        </Link>

        {/* Search */}
        <div className="flex-1 mx-8 flex gap-3">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-3.5 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-full py-3 pl-11 pr-5 outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </div>

        {/* Right */}
        <div className="flex items-center gap-5">
          {/* Notification */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
            >
              <Bell size={24} />

              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border overflow-hidden z-50">
                <div className="flex justify-between items-center p-4 border-b">
                  <h2 className="font-bold text-lg">🔔 Notifications</h2>

                  <button
                    onClick={() => {
                      navigate("/notifications");
                      setShowNotifications(false);
                    }}
                    className="text-green-600 text-sm hover:underline"
                  >
                    View All
                  </button>
                </div>

                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No notifications
                  </div>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      className={`border-b p-4 cursor-pointer hover:bg-gray-100 transition ${
                        !n.is_read ? "bg-blue-50" : ""
                      }`}
                    >
                      <h3 className="font-semibold">{n.title}</h3>

                      <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="font-semibold">{user?.name}</p>

              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden">
        {/* Top Row */}
        <div className="h-16 px-4 flex items-center justify-between">
          <Link to="/dashboard" className="text-2xl font-bold text-green-600">
            Lost&Found
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/notifications")}
              className="relative"
            >
              <Bell size={23} />

              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Bottom Row Search */}
        <div className="px-4 pb-3 flex gap-2">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-3.5 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-full py-3 pl-11 pr-5 outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
