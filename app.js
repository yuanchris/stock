
// ======= env ========
require('dotenv').config('./');

// =======================

const express = require('express');
const bodyparser = require('body-parser');
const fetch = require('node-fetch'); // npm install node-fetch --save

const app = express();
const { PORT, API_VERSION, IP } = process.env;


// app.set('view engine', 'ejs');
// app.engine('html', require('ejs').renderFile);
const path = require('path');
const hbs = require('express-hbs');

app.engine('hbs', hbs.express4({
  partialsDir: `${__dirname}/views/partials`,
}));
app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// ==== socket =====
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const roomInfo = {};
const roomPlay = {};

io.on('connection', (socket) => {
  // 获取请求建立socket连接的url
  // 如: http://localhost:3000/room/room_1, roomID为room_1
  const url = socket.request.headers.referer;
  const splited = url.split('/');
  const roomID = splited[splited.length - 1]; // 获取房间ID
  let user = '';

  socket.on('join', (userName) => {
    user = userName;

    // 将用户昵称加入房间名单中
    if (!roomInfo[roomID]) {
      roomInfo[roomID] = [];
    }
    if (roomInfo[roomID].indexOf(user) !== -1) {
      socket.emit('loginFail', '');
      return;
    }
    roomInfo[roomID].push(user);

    socket.join(roomID); // 加入房间
    // 通知房间内人员
    io.to(roomID).emit('sys', `${user}加入了房間`, roomInfo[roomID]);
    console.log(`${user}加入了${roomID}`);
  });


  // 接收用户消息,发送相应的房间
  socket.on('message', (msg) => {
    // 验证如果用户不在房间内则不给发送
    if (roomInfo[roomID].indexOf(user) === -1) {
      return false;
    }
    io.to(roomID).emit('msg', user, msg);
  });

  socket.on('beginPK', async (user_play) => {
    if (!roomPlay[roomID]) {
      roomPlay[roomID] = [];
    }
    if (roomPlay[roomID].indexOf(user_play) !== -1) {
      return false;
    }
    roomPlay[roomID].push(user_play);
    if (roomPlay[roomID].length == 2) {
      console.log('start to play');
      io.to(roomID).emit('sys', `${roomPlay[roomID]}即將開始遊戲`, roomInfo[roomID]);
      const start = await fetch(`${IP}/api/1.0/stock/pk`, {
        method: 'POST',
        body: JSON.stringify(roomPlay[roomID]),
        headers: { 'Content-Type': 'application/json' },
      }).then((res) => res.json());
      start.playstock = JSON.parse(start.playstock);

      const playStock = '2330 台積電';

      io.to(roomID).emit('PKdata', start.playdate, start.playstock, start.finishdate);
      roomPlay[roomID] = [];
      // socket.on('say to someone', (id, msg) => {
      //   socket.to(id).emit('my message', msg);
      // });
    }
  });
  socket.on('leave', () => {
    socket.emit('disconnect');
  });

  socket.on('disconnect', () => {
  // 从房间名单中移除
    console.log(roomInfo);
    const index = roomInfo[roomID].indexOf(user);
    if (roomPlay[roomID]) {
      const indexPlay = roomPlay[roomID].indexOf(user);
      if (indexPlay !== -1) {
        roomPlay[roomID].splice(index, 1);
      }
    }
    if (index !== -1) {
      roomInfo[roomID].splice(index, 1);
    }


    socket.leave(roomID); // 退出房间
    io.to(roomID).emit('sys', `${user}退出了房間`, roomInfo[roomID]);
    console.log(`${user}退出了${roomID}`);
  });
});

http.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
// ========
// app.listen(PORT, () => {
//   console.log(`Server started on port ${PORT}`);
// });

// ======= static page =====
app.use(express.static(`${__dirname}/public`));
// room page
app.get('/room/:roomID', (req, res) => {
  const { roomID } = req.params;
  res.render('room', {
    roomID,
    users: roomInfo[roomID],
  });
});

// CORS Control
app.use('/api/', (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization');
  res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.set('Access-Control-Allow-Credentials', 'true');
  next();
});


// API routes
// const userRoute = require('./server/routes/user_route.js');
// app.use('/user', userRoute);
app.use(`/api/${API_VERSION}`,
  [
    require('./server/routes/user_route'),
    require('./server/routes/stock_route'),
  ]);


// Error handling
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send('Internal Server Error');
});

module.exports = app;
