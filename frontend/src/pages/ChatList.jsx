import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { MoreVertical } from "lucide-react";
import { Search, MessageCircle, ArrowRight } from "lucide-react";
import api from "../services/api";
import MainLayout from "../layouts/MainLayout";

function ChatList() {
  const [chatList, setChatList] = useState([]);
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(null);

  const fetchChatList = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/messages/chat-list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setChatList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchChatList();
  }, []);

  const filteredChats = useMemo(() => {
    return chatList.filter((chat) =>
      chat.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [chatList, search]);

  const deleteChat = async (receiverId) => {
    if (!window.confirm("Delete this conversation?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/messages/chat/${receiverId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchChatList();

      toast.success("Chat deleted");

      setOpenMenu(null);
    } catch (err) {
      toast.error("Unable to delete chat");
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-100">
        <div
          className="max-w-4xl
mx-auto
py-4
md:py-8
px-3
md:px-6"
        >
          {/* Header */}

          <div className="bg-white rounded-3xl shadow-md p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">💬 Chats</h1>

                <p className="text-gray-500 mt-1">
                  Continue your conversations
                </p>
              </div>

              <MessageCircle className="text-green-600" size={38} />
            </div>

            {/* Search */}

            <div className="relative mt-6">
              <Search
                className="absolute left-4 top-3 text-gray-400"
                size={20}
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search chats..."
                className="w-full rounded-full border border-gray-200 bg-white py-3 pl-12 pr-4 outline-none transition-all duration-300 focus:border-green-500 focus:ring-4 focus:ring-green-100"
              />
            </div>
          </div>

          {filteredChats.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow">
              <div className="text-6xl">💬</div>

              <h2 className="text-2xl font-bold mt-5">No Chats Yet</h2>

              <p className="text-gray-500 mt-2">
                Start chatting from an item page.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredChats.map((chat) => (
                <Link
                  key={chat.id}
                  to={`/chat/${chat.id}`}
                  className="flex items-center justify-between rounded-3xl bg-white p-4 shadow-sm border border-gray-100 hover:border-green-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-14 h-14 shadow-md rounded-full bg-gradient-to-br from-green-500 to-emerald-700 text-white flex items-center justify-center text-xl font-bold">
                        {chat.name.charAt(0).toUpperCase()}
                      </div>

                      {/* Online Dot */}
                      <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-green-500 animate-pulse border-2 border-white"></span>
                    </div>

                    {/* Name & Message */}
                    <div className="flex-1 overflow-hidden">
                      <h2 className="font-semibold text-lg text-gray-800">
                        {chat.name}
                      </h2>

                      <div className="flex items-center gap-2">
                        <span className="text-blue-500 font-bold">✓✓</span>

                        <p className="text-gray-500 truncate text-sm">
                          {chat.last_message || "Start Conversation"}
                        </p>
                      </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs text-gray-500">
                        {chat.last_time
                          ? (() => {
                              const date = new Date(chat.last_time);
                              const now = new Date();

                              const diff =
                                (now.getTime() - date.getTime()) / 1000;

                              if (diff < 60) return "Now";

                              if (diff < 3600)
                                return `${Math.floor(diff / 60)}m`;

                              if (diff < 86400)
                                return `${Math.floor(diff / 3600)}h`;

                              return date.toLocaleDateString();
                            })()
                          : ""}
                      </span>

                      {/* Unread Badge */}
                      {Number(chat.unread_count) > 0 && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                          {chat.unread_count}
                        </div>
                      )}

                      <ArrowRight className="text-gray-400" size={18} />
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-gray-500">
                      {chat.last_time
                        ? (() => {
                            const date = new Date(chat.last_time);
                            const now = new Date();

                            const diff =
                              (now.getTime() - date.getTime()) / 1000;

                            if (diff < 60) return "Now";

                            if (diff < 3600) return `${Math.floor(diff / 60)}m`;

                            if (diff < 86400)
                              return `${Math.floor(diff / 3600)}h`;

                            return date.toLocaleDateString();
                          })()
                        : ""}
                    </span>

                    <ArrowRight className="text-gray-400" size={18} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default ChatList;
