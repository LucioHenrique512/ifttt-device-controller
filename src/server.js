require('dotenv/config')
const express= require("express");
const app = express()
const server = require('http').Server(app)
const io = require("socket.io")(server);
const cors = require("cors");
const PORT = process.env.PORT;
var socketio = null;

console.log(PORT)

app.use(cors())
app.use(express.json())

io.on("connection", (socket) => {
  socketio = socket;
  console.log(socket.id);
  
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
  console.log("I need stay alive. :)")
  return res.send({PORT});
});

app.post("/", (req, res) => {
  const { body } = req;
  handleReciveComand(body);
  return res.send({ ok: true });
});




server.listen(PORT);