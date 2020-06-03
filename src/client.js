require('dotenv/config')
const PORT = process.env.PORT;
const URLPATH = process.env.URLPATH;
const DEVICE_PS4_ADRESS = process.env.DEVICE_PS4_ADRESS;
const DEVICE_PS4_PASSCODE = process.env.DEVICE_PS4_PASSCODE;
const { Device } = require("ps4-waker");
const io = require("socket.io-client")(`${URLPATH}:${PORT}`);

const ps4 = new Device({ adress: DEVICE_PS4_ADRESS, passCode: DEVICE_PS4_PASSCODE });

ps4.getDeviceStatus().then(res=>console.log(res)).catch(err=>console.error(err))
console.log({env:{URLPATH,PORT,DEVICE_PS4_ADRESS,DEVICE_PS4_PASSCODE}})

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
        .catch((err) => console.log(err));
    case "OPEN_NETFLIX_PS4":
      ps4.startTitle("CUSA00129");
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
