const fetch = require('node-fetch');
const { PORT, IP } = process.env;

const roomInfo = {};
const roomPlay = {};

const start = function (io) {
  io.on('connection', (socket) => {
    console.log('socket initialized...');
    // get socket url
    // http://localhost:3000/room/room_1
    const url = socket.request.headers.referer;
    const splited = url.split('/');
    const roomID = splited[splited.length - 1]; // roomId = room_1


    let user = '';

    socket.on('join', (userName) => {
      user = userName;

      // add user to roomInfo
      if (!roomInfo[roomID]) {
        roomInfo[roomID] = [];
      }
      if (roomInfo[roomID].indexOf(user) !== -1) {
        socket.emit('loginFail', '');
        return;
      }
      roomInfo[roomID].push(user);

      socket.join(roomID); // join room
      // tell everyone in the room
      io.to(roomID).emit('sys', `${user}加入了房間`, roomInfo[roomID]);
      if (roomPlay[roomID]) {
        io.to(roomID).emit('sys', `房間內欲對戰的人：${roomPlay[roomID]}`);
      }
      // tell match list to calculate sum of people
      io.to('match.html').emit('list', `${user}加入了房間`, roomInfo);
      console.log(`${user}加入了${roomID}`);
      console.log(roomInfo);
    });


    // get message from user enter
    socket.on('message', (msg) => {
    // if not in the room, return false
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
        io.to(roomID).emit('sys', `房間內欲對戰的人：${roomPlay[roomID]}`);
        return false;
      }
      roomPlay[roomID].push(user_play);
      // emit play to every people in the room
      io.to(roomID).emit('sys', `房間內欲對戰的人：${roomPlay[roomID]}`);
      if (roomPlay[roomID].length == 2) {
        const start = await fetch(`${IP}/api/1.0/stock/pk`, {
          method: 'POST',
          body: JSON.stringify(roomPlay[roomID]),
          headers: { 'Content-Type': 'application/json' },
        }).then((res) => res.json());
        start.playstock = JSON.parse(start.playstock);

        io.to(roomID).emit('PKdata', start.playdate, start.playstock, start.finishdate, roomPlay[roomID]);
        roomPlay[roomID] = [];
        io.to(roomID).emit('sys', `房間內欲對戰的人：${roomPlay[roomID]}`);
      }
    });
    socket.on('leave', () => {
      socket.emit('disconnect');
    });

    socket.on('disconnect', () => {
      // delete from room

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


      socket.leave(roomID); // leave room
      io.to(roomID).emit('sys', `${user}退出了房間`, roomInfo[roomID]);
      console.log(`${user}退出了${roomID}`);
      console.log(roomInfo);
    });
  });
};

module.exports = {
  start,
  roomInfo,
};
