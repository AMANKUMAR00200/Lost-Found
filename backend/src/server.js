require("dotenv").config();
const pool = require("./config/db");
const express = require("express");
const cors = require("cors");
const { setIO } = require("./socket");


console.log({
  cloud: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY,
  secretLoaded: !!process.env.CLOUDINARY_API_SECRET,
});
const http = require("http");
const { Server } = require("socket.io");

const testRoute = require("./routes/test");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const itemRoutes = require("./routes/itemRoutes");
const matchRoutes = require("./routes/matchRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const claimRoutes = require("./routes/claimRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Vite frontend
    methods: ["GET", "POST"],
  },
});
setIO(io);

app.use(cors());
app.use(express.json());

app.use("/api", testRoute);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/claims", claimRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.send("Lost & Found API Running");
});

// ================= Socket.IO =================

const onlineUsers = {};

io.on("connection", (socket) => {
  console.log("🟢 User Connected:", socket.id);

  // =========================
  // Join
  // =========================

  socket.on("join", (userId) => {
    onlineUsers[userId] = socket.id;

    socket.join(userId.toString());

    console.log("User Joined Room:", userId);

    io.emit("online_users", Object.keys(onlineUsers));
  });

  // =========================
  // Send Message
  // =========================

  socket.on("send_message", async (data) => {
    try {
      const blocked = await pool.query(
        `
        SELECT *
        FROM blocked_users
        WHERE
        (blocked_by=$1 AND blocked_user=$2)
        OR
        (blocked_by=$2 AND blocked_user=$1)
        `,
        [data.senderId, data.receiverId]
      );

      if (blocked.rows.length > 0) return;

      const receiverSocket = onlineUsers[data.receiverId];

      if (receiverSocket) {
        io.to(receiverSocket).emit("receive_message", data);
      }
    } catch (err) {
      console.log(err);
    }
  });

  // =========================
  // Typing
  // =========================

  socket.on("typing", async (data) => {
    try {
      const blocked = await pool.query(
        `
        SELECT *
        FROM blocked_users
        WHERE
        (blocked_by=$1 AND blocked_user=$2)
        OR
        (blocked_by=$2 AND blocked_user=$1)
        `,
        [data.senderId, data.receiverId]
      );

      if (blocked.rows.length > 0) return;

      const receiverSocket = onlineUsers[data.receiverId];

      if (receiverSocket) {
        io.to(receiverSocket).emit("user_typing", {
          senderId: data.senderId,
        });
      }
    } catch (err) {
      console.log(err);
    }
  });

  // =========================
  // Stop Typing
  // =========================

  socket.on("stop_typing", async (data) => {
    try {
      const blocked = await pool.query(
        `
        SELECT *
        FROM blocked_users
        WHERE
        (blocked_by=$1 AND blocked_user=$2)
        OR
        (blocked_by=$2 AND blocked_user=$1)
        `,
        [data.senderId, data.receiverId]
      );

      if (blocked.rows.length > 0) return;

      const receiverSocket = onlineUsers[data.receiverId];

      if (receiverSocket) {
        io.to(receiverSocket).emit("user_stop_typing");
      }
    } catch (err) {
      console.log(err);
    }
  });

  // =========================
  // Seen
  // =========================

  socket.on("message_seen", (data) => {
    const senderSocket = onlineUsers[data.senderId];

    if (senderSocket) {
      io.to(senderSocket).emit("message_seen");
    }
  });

  // =========================
  // Disconnect
  // =========================

  socket.on("disconnect", () => {
    console.log("🔴 User Disconnected:", socket.id);

    for (const userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
      }
    }

    io.emit("online_users", Object.keys(onlineUsers));
  });
});

// =============================================



server.listen(process.env.PORT || 8000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 8000}`);
});
