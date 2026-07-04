import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Plus,
  MessageCircle,
  Bell,
  User,
  X,
} from "lucide-react";

function BottomNav() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Popup */}

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/40 z-40"
          />

          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[92%] max-w-sm rounded-3xl bg-white shadow-2xl p-6 z-50">

            <div className="flex justify-between items-center">

              <h2 className="text-xl font-bold">
                Report Item
              </h2>

              <button onClick={() => setOpen(false)}>
                <X />
              </button>

            </div>

            <div className="mt-6 space-y-4">

              <button
                onClick={() => {
                  navigate("/lost");
                  setOpen(false);
                }}
                className="w-full rounded-2xl bg-red-500 text-white py-4 text-lg font-semibold hover:bg-red-600"
              >
                🔴 Report Lost Item
              </button>

              <button
                onClick={() => {
                  navigate("/found");
                  setOpen(false);
                }}
                className="w-full rounded-2xl bg-green-600 text-white py-4 text-lg font-semibold hover:bg-green-700"
              >
                🟢 Report Found Item
              </button>

            </div>

          </div>
        </>
      )}

      {/* Bottom Navigation */}

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl h-20 z-30">

        <div className="flex justify-around items-center h-full">

          <NavLink
            to="/dashboard"
            className="flex flex-col items-center text-gray-600"
          >
            <Home size={24} />
            <span className="text-xs">Home</span>
          </NavLink>

          <button
            onClick={() => setOpen(true)}
            className="
            -mt-10
            h-16
            w-16
            rounded-full
            bg-green-600
            text-white
            shadow-xl
            flex
            items-center
            justify-center
            "
          >
            <Plus size={34} />
          </button>

          <NavLink
            to="/chat-list"
            className="flex flex-col items-center text-gray-600"
          >
            <MessageCircle size={24} />
            <span className="text-xs">
              Chats
            </span>
          </NavLink>

          <NavLink
            to="/notifications"
            className="flex flex-col items-center text-gray-600"
          >
            <Bell size={24} />
            <span className="text-xs">
              Alerts
            </span>
          </NavLink>

          <NavLink
            to="/my-items"
            className="flex flex-col items-center text-gray-600"
          >
            <User size={24} />
            <span className="text-xs">
              Profile
            </span>
          </NavLink>

        </div>

      </div>
    </>
  );
}

export default BottomNav;