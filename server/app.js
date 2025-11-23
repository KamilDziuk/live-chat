import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static(path.join(__dirname, "client")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

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

httpServer.listen(3004, () => {
  console.log("http://localhost:3004");
});
