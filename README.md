
# Live Chat

![presentation](/presentation.gif)

[Live version](https://livechat-fue3.onrender.com/)

## Overview

**Live Chat** is a real-time chat application built using **React**, **TypeScript**, and **Node.js**, bundled with **Vite**. It enables users to communicate instantly via WebSockets (`socket.io`) and features real-time notifications when users join or leave the chat. Each user is assigned a unique nickname color to make conversations visually distinct.

---

## Features

- Real-time messaging with **Socket.IO**
- User join/leave notifications
- Colored nicknames for each user
- Built with modern web technologies (React + TypeScript + Node.js)
- Lightweight and fast with **Vite** as the build tool

---

## Technology Stack

- **Frontend:** React, TypeScript, React Icons, Socket.IO(client)
- **Backend:** Node.js, Express, Socket.IO(server)
- **Build Tool:** Vite (TypeScript)


---

## Server

The backend uses **Socket.IO** to manage user connections and broadcast messages:

```ts
io.on("connection", (socket) => {
  socket.on("message", (m, t, c) => {
    io.emit("message", m, t, c);
  });

  socket.on("join", (n, c) => {
    socket.data.n = n;
    socket.data.c = c;
    socket.broadcast.emit("userJoined", n);
  });

  socket.on("disconnect", () => {
    if (socket.data.n) {
      io.emit("userLeft", socket.data.n);
    }
  });
});
```

* **`message`**: Broadcasts chat messages to all connected clients.
* **`join`**: Notifies others when a user joins the chat.
* **`disconnect`**: Notifies others when a user leaves the chat.

---

## Client

The frontend listens for events from the server and updates the chat UI in real-time:

```ts
socketRef.current?.on("message", (n: string, t: string, c: string) => {
  setMessage((messageContent: any) => [
    ...messageContent,
    { name: n, text: t, nickColor: c },
  ]);
});

socketRef.current?.on("userJoined", (user: string) => {
  setMessage((userStatus: any) => [
    ...userStatus,
    {
      name: "System",
      text: `${user} joined the chat`,
      nickColor: nickColor,
    },
  ]);
});

socketRef.current?.on("userLeft", (user: string) => {
  setMessage((userStatus: any) => [
    ...userStatus,
    {
      name: "System",
      text: `${user} left the chat`,
      nickColor: nickColor,
    },
  ]);
});

return () => {
  socketRef.current?.off("message");
  socketRef.current?.disconnect();
};

const send = () => {
  if (!text.trim() || !name.trim()) return;

  socketRef.current?.emit("message", name, text, nickColor);
  setText("");
  setDisabled(true);

  if (!disabled) {
    socketRef.current?.emit("join", name, nickColor);
    setDisabled(true);
  }
};
```

* Handles incoming messages and user join/leave notifications.
* Updates the chat with the user’s nickname and color.
* Sends messages to the backend via WebSocket.

---

## Running the Project

1. Clone the repository:

```bash
git clone https://github.com/KamilDziuk/live-chat.git
cd live-chat
```

2. Install dependencies:

```bash
npm install
```

3. Start the backend server:

```bash
node server.js
```

4. Start the frontend:

```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) to see the chat in action.

---

