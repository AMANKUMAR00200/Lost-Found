import { NavLink } from "react-router-dom";

const menus = [
  {
    title: "Home",
    path: "/Home",
    icon: "🏠",
  },
  {
    title: "Report Lost",
    path: "/lost",
    icon: "➕",
  },
  {
    title: "Report Found",
    path: "/found",
    icon: "📦",
  },
  {
    title: "My Items",
    path: "/my-items",
    icon: "👜",
  },
  {
    title: "Matches",
    path: "/matches",
    icon: "❤️",
  },
  {
    title: "Chats",
    path: "/chat-list",
    icon: "💬",
  },
  {
    title: "My Claims",
    path: "/claims",
    icon: "📄",
  },
];

function Sidebar() {
  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-white border-r shadow-sm">

      <div className="p-6">

        <h2 className="text-xl font-bold text-green-600">
          Menu
        </h2>

        <div className="mt-8 flex flex-col gap-2">

          {menus.map((menu) => (
            <NavLink
              key={menu.path}
              to={menu.path}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-xl px-4 py-3 transition-all
                ${
                  isActive
                    ? "bg-green-100 text-green-700 font-semibold"
                    : "hover:bg-gray-100"
                }`
              }
            >
              <span className="text-2xl">
                {menu.icon}
              </span>

              <span>{menu.title}</span>
            </NavLink>
          ))}

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;