### Prompt 1: Understanding Real-Time Communication

**Prompt:**

Explain the difference between HTTP request-response communication and WebSocket communication in simple terms. Help me understand why Socket.io is suitable for building a real-time chat application.

**Learning Outcome:**

Learned how persistent, bidirectional communication allows clients and servers to exchange messages without repeatedly refreshing the page or making polling requests.

### Prompt 2: Backend Setup with Express and Socket.io

**Prompt:**

Explain how to integrate Socket.io with an existing Node.js and Express server. Describe the purpose of the HTTP server, Socket.io initialization, connection events, and disconnection events.

**Learning Outcome:**

Understood how to initialize a Socket.io server and handle client connections and disconnections.

### Prompt 3: Connecting React to Socket.io

**Prompt:**

Explain how to connect a React application to a Socket.io backend using `socket.io-client`. Help me understand how to establish a connection and manage socket event listeners inside React's `useEffect` hook.

**Learning Outcome:**

Learned how the React frontend communicates with the backend and why event listeners require appropriate cleanup to prevent duplicate event handling.

### Prompt 4: Implementing Real-Time Messaging

**Prompt:**

Explain how to implement real-time message sending and receiving using Socket.io events. Clarify the differences between `socket.emit()`, `io.emit()`, and `socket.broadcast.emit()` with simple examples.

**Learning Outcome:**

Understood how messages travel from a client to the server and how the server broadcasts messages to connected clients.

### Prompt 5: Username and Session Identity

**Prompt:**

Help me understand how to collect a username before allowing a user to join a chat room. Explain how to associate the display name with a socket connection and display it alongside incoming messages.

**Learning Outcome:**

Learned how to maintain a display name for a connected socket and use it when rendering chat messages.

### Prompt 6: Implementing Typing Indicators

**Prompt:**

Explain how to implement typing indicators using Socket.io. Help me understand how to emit typing and stop-typing events, notify other users, and prevent typing indicators from remaining visible after a user stops typing.

**Learning Outcome:**

Understood event-based typing notifications, timeout-based inactivity detection, and room-specific typing indicators.

### Prompt 7: Room-Based Communication

**Prompt:**

Explain how Socket.io rooms work. Help me understand how to create separate chat channels, allow users to join selected rooms, and broadcast messages only to users subscribed to the relevant room.

**Learning Outcome:**

Learned how room-based message routing isolates conversations and prevents messages from being broadcast to unrelated rooms.

### Prompt 8: CORS and Connection Errors

**Prompt:**

Help me understand common CORS errors when connecting a React frontend to an Express and Socket.io backend running on different ports. Explain how to configure allowed origins for local development and deployment.

**Learning Outcome:**

Learned why frontend and backend origins must be configured correctly and why production deployments should allow only trusted origins.

### Prompt 9: Debugging Duplicate Messages

**Prompt:**

Explain why a React application may receive duplicate Socket.io messages in development mode. Help me understand React StrictMode, event listener cleanup, and how to use `socket.off()` appropriately.

**Learning Outcome:**

Learned how to prevent duplicate event handlers and manage socket listeners within the React component lifecycle.



