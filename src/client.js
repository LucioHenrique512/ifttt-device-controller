const { Device } = require("ps4-waker");
const io = require("socket.io-client")("http://localhost:8081/");

const ps4 = new Device({ adress: "192.168.0.112", passCode: "9605" });

const handleRecivePs4Action = (data) => {
  switch (data.action) {
    case "TURN_ON_PS4":
      return ps4
        .turnOn()
        .then((res) => {
          ps4.login();
          return {
            action: data.action,
            exec: true,
          };
        })
        .catch((err) => ({ action: data.action, exec: false }));
    case "TURN_OFF_PS4":
      return ps4
        .turnOff()
        .then((res) => ({ action: data.action, exec: true }))
        .catch((err) => ({ action: data.action, exec: false }));
    case "OPEN_NETFLIX_PS4":
      ps4.startTitle("NPUA80960");
      return { action: data.action, exec: true };
    case "OPEN_YOUTUBE_PS4":
      ps4.startTitle("CUSA01015");
      return { action: data.action, exec: true };
    default:
      return false;
  }
};

io.on("PS4_ACTION", async (data) => {
  const response = await handleRecivePs4Action(data);
  console.log(response);
  io.emit("ACTION_RESPONSE", response);
});

//const ps4 = new Device({adress: "192.168.0.112"})

//ps4.turnOff().then(res=>console.log(res)).catch(err=>console.log(err))
//ps4.turnOn().then(res=>console.log(res)).catch(err=>console.log(err))

//ps4.getDeviceStatus().then(res=>console.log(res)).catch(err=>console.log(err))

//ps4.startTitle('NPUA80960')
