import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  ShieldAlert,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import EmojiPicker from "emoji-picker-react";

function Chat() {
  const { receiverId } = useParams();
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);

  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [replyMessage, setReplyMessage] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const [typing, setTyping] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedByUser, setBlockedByUser] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [receiverInfo, setReceiverInfo] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    socketRef.current = io("http://localhost:8000", {
      transports: ["websocket"],
    });

    // ✅ Connected
    socketRef.current.on("connect", () => {
      console.log("✅ Connected:", socketRef.current.id);

      socketRef.current.emit("join", currentUser.id);
    });

    // ❌ Connection Error
    socketRef.current.on("connect_error", (err) => {
      console.log("❌ Connect Error:", err);
    });

    // 🔴 Disconnect
    socketRef.current.on("disconnect", (reason) => {
      console.log("🔴 Disconnect:", reason);
    });

    // Existing listeners
    socketRef.current.on("receive_message", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    socketRef.current.on("messages_seen", () => {
  setMessages((prev) =>
    prev.map((msg) => ({
      ...msg,
      is_seen: true,
    }))
  );
});

    socketRef.current.on("user_typing", () => {
      setTyping(true);
    });

    socketRef.current.on("user_stop_typing", () => {
      setTyping(false);
    });

    socketRef.current.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    const initChat = async () => {
      await checkBlockStatus();

      await loadReceiverInfo();

      await loadMessages();

      await markAsSeen();
    };

    initChat();

    return () => {
      socketRef.current?.disconnect();
    };
  }, [receiverId]);

  const loadMessages = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(`/messages/${receiverId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

     setIsBlocked(res.data.isBlocked);

setBlockedByUser(res.data.blockedByUser);
      setMessages(res.data.messages);
    } catch (err) {
      console.log(err);
      toast.error("Unable to load chat");
    } finally {
      setLoading(false);
    }
  };

  const markAsSeen = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/messages/seen/${receiverId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (socketRef.current?.connected) {
        socketRef.current.emit("message_seen", {
          senderId: receiverId,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const loadReceiverInfo = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(`/user/${receiverId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReceiverInfo(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  //sendMessage
  const sendMessage = async () => {
    if (!message.trim() && !image) return;
    let imageUrl = null;

    try {
      const token = localStorage.getItem("token");
      if (image) {
        const formData = new FormData();

        formData.append("image", image);

        const uploadRes = await api.post("/upload", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        imageUrl = uploadRes.data.imageUrl;
      }

      const response = await api.post(
        "/messages",
        {
          receiverId,
          itemId: null,
          message,
          imageUrl,
          replyTo: replyMessage?.id || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("✅ Message Saved:", response.data);

      setMessage("");
      setImage(null);
      setReplyMessage(null);
      loadMessages();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send");
    }
  };

  //deleteForMe
  const deleteForMe = async (messageId) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/messages/delete/me/${messageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      loadMessages();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  //deleteForEveryone
  const deleteForEveryone = async (messageId) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/messages/delete/everyone/${messageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      loadMessages();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  //handleReply
  const handleReply = (msg) => {
    setReplyMessage(msg);
  };

  //blockUser
  const blockUser = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/messages/block",
        {
          userId: receiverId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("User Blocked");
    } catch (err) {
      toast.error("Unable to block user");
    }
  };
  const unblockUser = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/messages/unblock",
        {
          userId: receiverId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setIsBlocked(false);

      toast.success("User Unblocked");
    } catch (err) {
      toast.error("Unable to unblock");
    }
  };
  //reportUser
  const reportUser = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/messages/report",
        {
          userId: receiverId,
          reason: "Inappropriate behaviour",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("User Reported");
    } catch (err) {
      toast.error("Unable to report user");
    }
  };

  //block-un
  const checkBlockStatus = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(`/messages/block-status/${receiverId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsBlocked(res.data.blocked);

      setBlockedByUser(res.data.blockedByUser);
    } catch (err) {
      console.log(err);
    }
  };

  //startRecording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, {
          type: "audio/webm",
        });

        const formData = new FormData();
        formData.append("audio", blob, "voice.webm");

        try {
          const uploadRes = await api.post("/upload/voice", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          const audioUrl = uploadRes.data.audioUrl;

          await api.post(
            "/messages",
            {
              receiverId,
              message: "",
              audioUrl,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },
          );

          loadMessages();
        } catch (err) {
          console.log(err);
        }
      };
      stream.getTracks().forEach((track) => track.stop());

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.log(err);
    }
  };

  //stopRecording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }

    setRecording(false);
  };

  //onEmojiClic
  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmoji(false);
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-white shadow-md border-b">
        <div className="h-16 px-4 flex justify-between items-center">
          {/* Left */}

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft size={22} />
            </button>

            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-green-600 text-white flex items-center justify-center text-lg font-bold">
                {receiverInfo?.name
                  ? receiverInfo.name.charAt(0).toUpperCase()
                  : "U"}
              </div>

              {!isBlocked &&
                !blockedByUser &&
                onlineUsers.includes(receiverId.toString()) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></span>
                )}
            </div>

            <div>
              <h2 className="font-bold text-lg">
                {receiverInfo?.name || "User"}
              </h2>

              <p className="text-xs text-gray-500">
                {isBlocked || blockedByUser
                  ? ""
                  : onlineUsers.includes(receiverId.toString())
                    ? "🟢 Online"
                    : "⚫ Offline"}
              </p>
            </div>
          </div>

          {/* Right */}

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Phone size={20} />
            </button>

            <button className="p-2 rounded-full hover:bg-gray-100">
              <Video size={20} />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <MoreVertical size={20} />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-xl border w-48 overflow-hidden">
                  {isBlocked ? (
                    <button
                      onClick={unblockUser}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100"
                    >
                      🔓 Unblock User
                    </button>
                  ) : (
                    <button
                      onClick={blockUser}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100"
                    >
                      🚫 Block User
                    </button>
                  )}

                  <button
                    onClick={reportUser}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <ShieldAlert size={16} />
                    Report
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 md:px-6 py-4 space-y-2">
        {typing && (
          <div className="flex items-center gap-2 px-4 py-2">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-bounce"></span>

              <span
                className="w-2 h-2 rounded-full bg-green-500 animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></span>

              <span
                className="w-2 h-2 rounded-full bg-green-500 animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></span>
            </div>

            <span className="text-sm text-gray-500">Typing...</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full text-gray-500">
            <div className="text-7xl mb-4">💬</div>

            <h2 className="font-bold text-xl">Start Conversation</h2>

            <p className="mt-2">Send your first message.</p>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => {
              const currentDate = new Date(msg.created_at).toDateString();

              const previousDate =
                index > 0
                  ? new Date(messages[index - 1].created_at).toDateString()
                  : "";

              const isMine = msg.sender_id === currentUser.id;

              return (
                <>
                  {currentDate !== previousDate && (
                    <div className="flex justify-center my-5">
                      <span className="bg-gray-300 text-gray-700 text-xs px-4 py-2 rounded-full shadow">
                        {currentDate}
                      </span>
                    </div>
                  )}
                  <div
                    key={msg.id}
                    className={`flex mb-4 ${
                      msg.sender_id === currentUser.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`relative max-w-[85%] md:max-w-[60%] rounded-3xl px-4 py-3 shadow-lg transition-all duration-300
  ${
    isMine
      ? "bg-gradient-to-r from-green-500 to-green-600 text-white rounded-br-md"
      : "bg-white border border-gray-200 text-gray-800 rounded-bl-md"
  }`}
                    >
                      {/* Reply Preview */}
                      {msg.reply_to && (
                        <div
                          className={`rounded-xl p-3 mb-3 border-l-4 ${
                            isMine
                              ? "bg-white/20 border-yellow-300"
                              : "bg-gray-100 border-green-500"
                          }`}
                        >
                          <p className="text-xs font-semibold text-green-700">
                            Reply
                          </p>

                          <p className="text-sm truncate">
                            {msg.reply_message}
                          </p>
                        </div>
                      )}
                      {/* Text */}
                      <p className="break-words whitespace-pre-wrap leading-6 text-[15px]">
  {msg.is_deleted_everyone
    ? "This message was deleted"
    : msg.message}
</p>

                      {/* Image */}
                      {!msg.is_deleted_everyone && msg.image_url && (
                        <img src={msg.image_url} className="rounded-xl" />
                      )}

                      {/* Audio */}
                      {!msg.is_deleted_everyone && msg.audio_url && (
                        <audio controls src={msg.audio_url} />
                      )}

                      {/* Reply */}
                      <button
                        onClick={() => handleReply(msg)}
                        className="font-bold text-blue-500 mt-2"
                      >
                        Reply
                      </button>

                      {/* Time */}
                      <div className="flex justify-end items-center gap-2 mt-3 text-[11px] opacity-80">
                        <span>
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>

                        {isMine && (
                          <span
                            className={
                              msg.is_seen
                                ? "font-bold text-blue-300"
                                : "font-bold text-gray-400"
                            }
                          >
                            {msg.is_seen ? "✓✓" : "✓"}
                          </span>
                        )}
                      </div>

                      {/* Delete */}
                      {isMine && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => deleteForMe(msg.id)}
                            className="font-bold bg-white text-black px-2 py-1 rounded"
                          >
                            Delete Me
                          </button>

                          <button
                            onClick={() => deleteForEveryone(msg.id)}
                            className="font-bold bg-red-500 text-white px-2 py-1 rounded"
                          >
                            Delete All
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              );
            })}

            <div ref={bottomRef}></div>
          </>
        )}
      </div>
      {/* Bottom Input */}
      <div
        className="sticky bottom-0 bg-white border-t px-3 md:px-5 py-3 shadow-lg"
        style={{
          paddingBottom: "max(env(safe-area-inset-bottom),12px)",
        }}
      >
        {/* Reply Preview */}
        {replyMessage && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-4 flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-600">Replying to</p>
              <p className="text-sm">{replyMessage.message}</p>
            </div>

            <button
              onClick={() => setReplyMessage(null)}
              className="text-red-500 text-lg"
            >
              ✕
            </button>
          </div>
        )}

        {/* Image Preview */}
        {image && (
          <div className="mb-3">
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="w-44 rounded-2xl border shadow"
            />

            <button
              onClick={() => setImage(null)}
              className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition"
            >
              Remove
            </button>
          </div>
        )}
        {blockedByUser && (
          <div className="mb-3 rounded-xl bg-red-100 border border-red-300 p-3 text-center text-red-700">
            You can't send messages because this user has blocked you.
          </div>
        )}

        {isBlocked && (
          <div className="mb-3 rounded-xl bg-yellow-100 border border-yellow-300 p-3 text-center">
            You blocked this user.
            <button
              onClick={unblockUser}
              className="ml-3 rounded-lg bg-green-600 px-3 py-2 text-white"
            >
              Unblock
            </button>
          </div>
        )}

        {/* Emoji Picker */}
        {showEmoji && (
          <div className="mb-3">
            <EmojiPicker onEmojiClick={onEmojiClick} width="100%" />
          </div>
        )}

        <div className="flex items-end gap-3">
          {/* Emoji */}

          <button
            onClick={() => setShowEmoji(!showEmoji)}
            className="w-11 h-11 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-2xl transition"
          >
            😊
          </button>

          {/* Gallery */}

          <input
            type="file"
            id="image"
            hidden
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <label
            htmlFor="image"
            className="w-11 h-11 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer text-xl transition"
          >
            📎
          </label>

          {/* Message */}

          <div className="flex-1">
            <input
              autoFocus
              disabled={isBlocked || blockedByUser}
              type="text"
              placeholder={
                blockedByUser
                  ? "This user blocked you"
                  : isBlocked
                    ? "You blocked this user"
                    : "Type a message..."
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              className="w-full rounded-full border border-gray-300 px-5 py-3 outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Mic */}

          <button
            onClick={recording ? stopRecording : startRecording}
            disabled={isBlocked || blockedByUser}
            className={`w-12 h-12 rounded-full text-white flex items-center justify-center transition
      ${recording ? "bg-red-600 animate-pulse" : "bg-gray-700 hover:bg-black"}`}
          >
            {recording ? "⏹" : "🎤"}
          </button>

          {/* Send */}

          <button
            onClick={sendMessage}
            disabled={isBlocked || blockedByUser}
            className="w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 text-white text-xl flex items-center justify-center shadow-lg transition"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
