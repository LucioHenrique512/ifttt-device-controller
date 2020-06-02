const io = require("socket.io").listen(8081);
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

var socketio = null;

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

io.on("connection", (socket) => {
  socketio = socket;
  console.log(socket.id);
  socket.emit();
});

const handleReciveComand = (payload) => {
  console.log(payload);
  if (payload) {
    if (payload.device === "ps4") {
      socketio.emit("PS4_ACTION", { action: payload.action });
    }
  }
};

app.get("/", (req, res) => {
  return res.send(socketio.id);
});

app.post("/", (req, res) => {
  const { body } = req;
  handleReciveComand(body);
  return res.send({ ok: true });
});

app.listen(8080);
