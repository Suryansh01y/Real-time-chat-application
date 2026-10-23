require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const PORT = Number(process.env.PORT) || 3000;
const defaultOrigin = "http://localhost:5173";
const configuredOrigins = (process.env.CLIENT_ORIGIN || defaultOrigin)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: configuredOrigins }));
app.use(express.json({ limit: "20kb" }));

const io = new Server(server, {
  cors: {
    origin: configuredOrigins,
    methods: ["GET", "POST"],
  },
  pingTimeout: 20000,
  pingInterval: 25000,
});

const ALLOWED_ROOMS = new Set(["General", "Tech Support"]);
const MAX_MESSAGE_LENGTH = 1000;
const MAX_USERNAME_LENGTH = 24;

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "sprint12-realtime-chat",
    connectedClients: io.engine.clientsCount,
    timestamp: new Date().toISOString(),
  });
});

function cleanText(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function validRoom(room) {
  return ALLOWED_ROOMS.has(room);
}

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.data.username = "Guest";
  socket.data.room = null;

  socket.on("join-room", (payload, acknowledge) => {
    const username = cleanText(payload?.username, MAX_USERNAME_LENGTH);
    const room = payload?.room;

    if (!username) {
      if (typeof acknowledge === "function") {
        acknowledge({ ok: false, error: "Enter a username before joining." });
      }
      return;
    }

    if (!validRoom(room)) {
      if (typeof acknowledge === "function") {
        acknowledge({ ok: false, error: "Please select a valid room." });
      }
      return;
    }

    const previousRoom = socket.data.room;
    if (previousRoom) {
      socket.to(previousRoom).emit("user-left", {
        username: socket.data.username,
        room: previousRoom,
      });
      socket.leave(previousRoom);
    }

    socket.data.username = username;
    socket.data.room = room;
    socket.join(room);

    socket.to(room).emit("user-joined", { username, room });

    if (typeof acknowledge === "function") {
      acknowledge({ ok: true, username, room });
    }
  });

  socket.on("chat-message", (payload, acknowledge) => {
    const room = socket.data.room;
    const message = cleanText(payload?.message, MAX_MESSAGE_LENGTH);

    if (!room || !validRoom(room)) {
      if (typeof acknowledge === "function") {
        acknowledge({ ok: false, error: "Join a room before sending messages." });
      }
      return;
    }

    if (!message) {
      if (typeof acknowledge === "function") {
        acknowledge({ ok: false, error: "Message cannot be empty." });
      }
      return;
    }

    const messageData = {
      id: `${Date.now()}-${socket.id}`,
      username: socket.data.username,
      message,
      room,
      timestamp: new Date().toISOString(),
    };

    // Send to every member of this room, including the sender.
    io.to(room).emit("chat-message", messageData);

    if (typeof acknowledge === "function") acknowledge({ ok: true });
  });

  socket.on("typing", (payload) => {
    const room = socket.data.room;
    if (!room || !validRoom(room)) return;

    socket.to(room).emit("typing", {
      username: socket.data.username,
      room,
      isTyping: Boolean(payload?.isTyping),
    });
  });

  socket.on("stop-typing", () => {
    const room = socket.data.room;
    if (!room || !validRoom(room)) return;

    socket.to(room).emit("typing", {
      username: socket.data.username,
      room,
      isTyping: false,
    });
  });

  socket.on("disconnect", (reason) => {
    const room = socket.data.room;
    if (room) {
      socket.to(room).emit("typing", {
        username: socket.data.username,
        room,
        isTyping: false,
      });
      socket.to(room).emit("user-left", {
        username: socket.data.username,
        room,
      });
    }
    console.log(`Socket disconnected: ${socket.id} (${reason})`);
  });
});

server.listen(PORT, () => {
  console.log(`Chat backend listening on port ${PORT}`);
  console.log(`Allowed frontend origin(s): ${configuredOrigins.join(", ")}`);
});
