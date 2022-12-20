const express = require("express");
const app = express();
app.use(express.static("./public"));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", "./views");
var sever = require("http").Server(app);
var io = require("socket.io")(sever);
const locations = [];
sever.listen(process.env.PORT || 3000);
io.on("connection", function (socket) {
  console.log("co nguoi ket noi :" + socket.id);
  socket.emit("sever-connect", socket.id);

  app.post("/", function (req, res) {
    const flag = locations
      .map(function (e) {
        return e.username;
      })
      .indexOf(req.body.username);
    if (flag < 0) {
      locations.push({
        username: req.body.username,
        id: req.body.socketid,
        //? lap lai id ?????
        lat: req.body.latitude,
        long: req.body.longitude,
      });
      console.log(`them thanh cong hien tai co ${locations.length}`);
    } else {
      locations[flag].lat = req.body.latitude;
      locations[flag].long = req.body.longitude;
    }

    res.json(
      locations
      //   {
      //   status: "success getting lat and lon",
      //   latitude: req.body.latitude,
      //   longitude: req.body.longitude,
      //   place:locations
      // }
    );
  });
  socket.on("disconnect", function () {
    const dele = locations
      .map(function (e) {
        console.log(e.id + "     " + socket.id);
        return e.id;
      })
      .indexOf(socket.id);
    if (dele < 0) {
      console.log(`user voi id: ${socket.id} da thoat`);
      console.log(`hien tai co ${locations.length}`);
    } else {
      const removed = locations.splice(dele);
      io.sockets.emit("close", removed[0].username);
      console.log(`user voi NAME: ${removed[0].username} da thoat`);
      console.log(`hien tai co ${locations.length}`);
    }
  });
});
