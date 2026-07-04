import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
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
    } catch (err) {
      console.log(err);
    }
  };

  const markRead = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/notifications/read/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      loadNotifications();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      loadNotifications();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-8">
          🔔 Notifications
        </h1>

        {notifications.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            No Notifications
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`mb-4 rounded-xl border p-5 shadow ${
                n.is_read ? "bg-white" : "bg-blue-50"
              }`}
            >
              <h2 className="font-bold text-lg">
                {n.title}
              </h2>

              <p className="text-gray-600 mt-2">
                {n.message}
              </p>

              <div className="flex gap-3 mt-4">

                {!n.is_read && (
                  <button
                    onClick={() => markRead(n.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    Mark Read
                  </button>
                )}

                <button
                  onClick={() => deleteNotification(n.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Delete
                </button>

              </div>

            </div>
          ))
        )}

      </div>
    </MainLayout>
  );
}

export default Notifications;