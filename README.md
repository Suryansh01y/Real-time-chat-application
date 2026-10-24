# PulseChat — Real-Time Chat Application

A full-stack real-time chat application built using React, Node.js, Express.js, and Socket.io. The application enables users to exchange messages instantly, view typing indicators, and communicate in separate chat rooms without refreshing the page.

This project was developed as part of **Sprint 12 — Real-Time Systems & UI Isolation**, Track B: Fullstack Developers.

## Links

Live:- https://real-time-chat-application-eosin-seven.vercel.app/

Video:- https://drive.google.com/drive/folders/13y59ZjZU_pn_lZDy5C12zTnJaH3DOMRh?usp=sharing

## 🚀 Features

### Phase 1: WebSocket Initialization & Base MVP (P0)

* **Real-Time Communication:** Establishes a persistent connection between the React frontend and the Socket.io backend.
* **Instant Messaging:** Users can send and receive messages in real time.
* **Message Broadcasting:** Messages are delivered to connected users in the same chat room.
* **Connection Status:** Displays the current connection status.
* **Message Timestamps:** Displays the time each message was sent.

### Phase 2: Session Identity & Event Emitters (P1)

* **Username Identification:** Users enter a display name before joining a chat room.
* **Personalized Messages:** Displays the sender's username with each message.
* **Typing Indicators:** Shows when another user is typing.
* **Event Handling:** Uses Socket.io events to manage messages and typing activity.
* **Event Cleanup:** Removes event listeners appropriately to avoid duplicate message handling.

### Phase 3: Channel Segregation & Routing Logic (P2)

* **Multiple Chat Rooms:** Supports General and Tech Support rooms.
* **Room-Based Messaging:** Messages are delivered only to members of the selected room.
* **Typing Isolation:** Typing indicators are restricted to the relevant room.
* **Room Switching:** Users can switch between available chat rooms.
* **Message Isolation:** Conversations remain separated between different rooms.

### Additional Features

* Responsive user interface for desktop and mobile devices.
* Input validation for usernames and messages.
* Connection and error status indicators.
* Clean, component-based React architecture.
* Backend health-check endpoint.
* Reconnection support through Socket.io.
* Separate frontend and backend workspaces.

## 🛠️ Technologies Used

| Technology       | Purpose                                    |
| ---------------- | ------------------------------------------ |
| React.js         | Frontend user interface                    |
| Vite             | Frontend development server and build tool |
| JavaScript       | Application logic                          |
| Node.js          | Backend runtime                            |
| Express.js       | HTTP server and API setup                  |
| Socket.io        | Real-time, bidirectional communication     |
| Socket.io Client | Connects React to the backend              |
| CSS3             | Responsive styling                         |
| Git and GitHub   | Version control and source code management |

## 📁 Project Structure

```text
sprint12-realtime-chat/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── socket.js
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── .gitignore
├── package.json
├── README.md
└── Prompts.md
```



## 💬 How to Use the Application

1. Open the application in your browser.
2. Enter a username.
3. Select either General or Tech Support.
4. Click **Join Chat**.
5. Type a message and send it.
6. Open the application in another browser window or browser profile.
7. Join using a different username.
8. Send messages between the two sessions.
9. Observe the typing indicators.
10. Switch between rooms and verify that messages remain isolated.

## 🔄 How Real-Time Communication Works

The application uses Socket.io to establish bidirectional communication between the client and server.

The message flow is:

```text
React Client
     |
     | Emit chat-message
     v
Socket.io Server
     |
     | Validate message and active room
     v
Broadcast to Selected Room
     |
     v
Connected Clients in That Room
     |
     v
React UI Updates Instantly
```

Important Socket.io events include:

| Event          | Purpose                                        |
| -------------- | ---------------------------------------------- |
| `connection`   | Detects a new client connection                |
| `disconnect`   | Detects a disconnected client                  |
| `join-room`    | Adds a user to a selected room                 |
| `chat-message` | Sends and receives chat messages               |
| `typing`       | Indicates that a user is typing                |
| `stop-typing`  | Clears the typing indicator                    |
| `user-joined`  | Notifies other room members when a user joins  |
| `user-left`    | Notifies other room members when a user leaves |

## 🧪 Testing and QA

Test the following scenarios before submitting the project:

* [ ] The frontend connects successfully to the backend.
* [ ] Two separate browser sessions can join the chat.
* [ ] Messages are delivered without refreshing the page.
* [ ] Sender names appear with messages.
* [ ] Message timestamps display correctly.
* [ ] Typing indicators appear in the other browser.
* [ ] Typing indicators disappear when typing stops.
* [ ] General room messages do not appear in Tech Support.
* [ ] Room switching works correctly.
* [ ] Empty usernames and empty messages are handled.
* [ ] The connection status updates when the backend disconnects.
* [ ] The application layout works on mobile and desktop.
* [ ] The backend health endpoint responds successfully.

## 📚 Learning Outcomes

Through this project, I learned about:

* Real-time, bidirectional communication.
* WebSockets and Socket.io.
* Integrating Socket.io with an Express server.
* Managing socket connections in React.
* Handling client-server events.
* Implementing typing indicators.
* Designing room-based message routing.
* Isolating communication between chat rooms.
* Debugging CORS and duplicate event-listener issues.
* Testing real-time applications using multiple browser sessions.
* Preparing an application for deployment.
