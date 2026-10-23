import { useEffect, useRef, useState } from "react";
import { socket } from "./socket";

const ROOMS = ["General", "Tech Support"];

function formatTime(timestamp) {
  return new Intl.DateTimeFormat([], {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export default function App() {
  const [usernameInput, setUsernameInput] = useState("");
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("General");
  const [joined, setJoined] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [messagesByRoom, setMessagesByRoom] = useState({
    General: [],
    "Tech Support": [],
  });
  const [typingUsers, setTypingUsers] = useState({});
  const [connection, setConnection] = useState("Disconnected");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const typingTimer = useRef(null);
  const messagesEndRef = useRef(null);

  const messages = messagesByRoom[room] || [];
  const currentTypingUsers = Object.entries(typingUsers)
    .filter(([key, value]) => key.startsWith(`${room}:`) && value)
    .map(([key]) => key.slice(room.length + 1));

  useEffect(() => {
    const onConnect = () => setConnection("Connected");
    const onDisconnect = () => setConnection("Disconnected");
    const onConnectError = () => setConnection("Reconnecting…");

    const onMessage = (data) => {
      setMessagesByRoom((current) => ({
        ...current,
        [data.room]: [...(current[data.room] || []), data].slice(-300),
      }));
    };

    const onTyping = (data) => {
      const key = `${data.room}:${data.username}`;
      setTypingUsers((current) => {
        const next = { ...current };
        if (data.isTyping) next[key] = true;
        else delete next[key];
        return next;
      });
    };

    const onUserJoined = (data) => {
      if (data.username !== username) {
        setNotice(`${data.username} joined ${data.room}`);
        window.setTimeout(() => setNotice(""), 2500);
      }
    };

    const onUserLeft = (data) => {
      setTypingUsers((current) => {
        const next = { ...current };
        delete next[`${data.room}:${data.username}`];
        return next;
      });
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("chat-message", onMessage);
    socket.on("typing", onTyping);
    socket.on("user-joined", onUserJoined);
    socket.on("user-left", onUserLeft);

    socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("chat-message", onMessage);
      socket.off("typing", onTyping);
      socket.off("user-joined", onUserJoined);
      socket.off("user-left", onUserLeft);
      if (typingTimer.current) window.clearTimeout(typingTimer.current);
      socket.disconnect();
    };
  }, [username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const joinRoom = (event) => {
    event.preventDefault();
    const cleanedName = usernameInput.trim().slice(0, 24);
    if (!cleanedName) {
      setError("Please enter a username.");
      return;
    }

    setError("");
    socket.emit("join-room", { username: cleanedName, room }, (result) => {
      if (!result?.ok) {
        setError(result?.error || "Could not join the room.");
        return;
      }
      setUsername(cleanedName);
      setJoined(true);
    });
  };

  const switchRoom = (nextRoom) => {
    if (nextRoom === room) return;
    setRoom(nextRoom);
    setMessageInput("");
    setTypingUsers((current) => {
      const next = { ...current };
      Object.keys(next).forEach((key) => {
        if (key.startsWith(`${room}:`)) delete next[key];
      });
      return next;
    });

    if (joined) {
      socket.emit("join-room", { username, room: nextRoom }, (result) => {
        if (!result?.ok) setError(result?.error || "Could not switch rooms.");
        else setError("");
      });
    }
  };

  const stopTyping = () => {
    if (typingTimer.current) window.clearTimeout(typingTimer.current);
    socket.emit("stop-typing");
  };

  const handleMessageChange = (event) => {
    setMessageInput(event.target.value);
    if (!joined) return;

    socket.emit("typing", { isTyping: true });
    if (typingTimer.current) window.clearTimeout(typingTimer.current);
    typingTimer.current = window.setTimeout(stopTyping, 1000);
  };

  const sendMessage = (event) => {
    event.preventDefault();
    const message = messageInput.trim();
    if (!message || !joined) return;

    socket.emit("chat-message", { message }, (result) => {
      if (!result?.ok) setError(result?.error || "Message could not be sent.");
      else setError("");
    });

    setMessageInput("");
    stopTyping();
  };

  if (!joined) {
    return (
      <main className="join-page">
        <section className="join-card">
          <div className="brand-mark">P</div>
          <p className="eyebrow">SPRINT 12 · TRACK B</p>
          <h1>Meet in real time.</h1>
          <p className="muted">
            A room-based chat demo powered by React, Express, and Socket.io.
          </p>
          <form className="join-form" onSubmit={joinRoom}>
            <label htmlFor="username">Your display name</label>
            <input
              id="username"
              value={usernameInput}
              onChange={(event) => setUsernameInput(event.target.value)}
              maxLength={24}
              placeholder="e.g. Suryansh"
              autoComplete="nickname"
            />
            <label htmlFor="initial-room">Choose a room</label>
            <select
              id="initial-room"
              value={room}
              onChange={(event) => setRoom(event.target.value)}
            >
              {ROOMS.map((item) => <option key={item}>{item}</option>)}
            </select>
            {error && <p className="error-text" role="alert">{error}</p>}
            <button className="primary-button" type="submit">Join chat <span>→</span></button>
          </form>
          <div className="connection-note">
            <span className={`status-dot ${connection === "Connected" ? "online" : ""}`} />
            Server: {connection}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark small">P</div>
          <div>
            <strong>PulseChat</strong>
            <span>Real-time communication</span>
          </div>
        </div>
        <div className="profile">
          <span className={`status-dot ${connection === "Connected" ? "online" : ""}`} />
          <span className="connection-label">{connection}</span>
          <div className="avatar">{username.charAt(0).toUpperCase()}</div>
          <span className="profile-name">{username}</span>
        </div>
      </header>

      <section className="chat-layout">
        <aside className="sidebar">
          <div className="sidebar-heading">
            <p className="eyebrow">WORKSPACE</p>
            <h2>Chat rooms</h2>
          </div>
          <div className="room-list" aria-label="Choose chat room">
            {ROOMS.map((item, index) => (
              <button
                key={item}
                className={`room-button ${room === item ? "active" : ""}`}
                onClick={() => switchRoom(item)}
                aria-pressed={room === item}
              >
                <span className="room-icon">{index === 0 ? "#" : "◈"}</span>
                <span className="room-copy">
                  <strong>{item}</strong>
                  <small>{index === 0 ? "Open conversation" : "Get help from the team"}</small>
                </span>
                {room === item && <span className="active-arrow">›</span>}
              </button>
            ))}
          </div>
          <div className="sidebar-bottom">
            <span className="status-dot online" />
            <div><strong>Live connection</strong><small>Socket.io enabled</small></div>
          </div>
        </aside>

        <section className="chat-panel">
          <div className="chat-heading">
            <div>
              <p className="eyebrow">CHANNEL</p>
              <h1><span className="hash">{room === "General" ? "#" : "◈"}</span> {room}</h1>
              <p className="muted">{room === "General" ? "A place for everyone to connect." : "Ask questions and help each other."}</p>
            </div>
            <div className="member-pill"><span className="status-dot online" /> Live</div>
          </div>

          {notice && <div className="notice" role="status">{notice}</div>}

          <div className="messages" aria-live="polite" aria-label={`${room} messages`}>
            {messages.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">✳</div>
                <h3>Start the conversation</h3>
                <p>No messages in this room yet. Say hello to get things moving.</p>
              </div>
            ) : (
              messages.map((item) => {
                const ownMessage = item.username === username;
                return (
                  <article className={`message-row ${ownMessage ? "own" : ""}`} key={item.id}>
                    {!ownMessage && <div className="message-avatar">{item.username.charAt(0).toUpperCase()}</div>}
                    <div className="message-content">
                      <div className="message-meta">
                        <strong>{ownMessage ? "You" : item.username}</strong>
                        <time dateTime={item.timestamp}>{formatTime(item.timestamp)}</time>
                      </div>
                      <p className="message-bubble">{item.message}</p>
                    </div>
                    {ownMessage && <div className="message-avatar own-avatar">{username.charAt(0).toUpperCase()}</div>}
                  </article>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="typing-area" aria-live="polite">
            {currentTypingUsers.length > 0 && (
              <span><i className="typing-dots"><b /><b /><b /></i> {currentTypingUsers.join(", ")} {currentTypingUsers.length === 1 ? "is" : "are"} typing…</span>
            )}
          </div>

          {error && <p className="error-text inline-error" role="alert">{error}</p>}
          <form className="message-form" onSubmit={sendMessage}>
            <input
              value={messageInput}
              onChange={handleMessageChange}
              maxLength={1000}
              placeholder={`Message ${room}…`}
              aria-label="Message"
            />
            <span className="input-hint">Enter to send</span>
            <button type="submit" className="send-button" disabled={!messageInput.trim()} aria-label="Send message">➤</button>
          </form>
          <p className="footer-note">Messages are delivered instantly · Keep it kind.</p>
        </section>
      </section>
    </main>
  );
}
