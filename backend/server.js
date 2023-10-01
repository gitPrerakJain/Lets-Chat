const express = require("express");
const dotenv = require("dotenv");
// const cors = require("cors");
// const { chats } = require("./data/data");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
// console.log(require("dotenv").config());

dotenv.config();
connectDB();
const app = express();

app.use(express.json()); // to accept json data
// app.use(cors);

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

const server = app.listen(port, console.log(`Server started on port ${port}`));

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  // console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    // console.log(userData._id);
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    // console.log("userJoined", room);
    socket.join(room);
  });

  socket.on("typing", (room) => {
    // console.log("user typing in room: ", room);
    socket.in(room).emit("typing");
  });
  socket.on("stop typing", (room) => {
    // console.log("user stopped typing in room: ", room);
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
      console.log("inside new mesage");
    });
  });

  socket.off("setup", () => {
    console.log("Disconnected user from socket");
    socket.leave(userData._id);
  });
});
