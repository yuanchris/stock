const name = localStorage.getItem('name');
main();
async function main() {
  if (!name) {
    await swal('請先登入');
    window.location.href = 'sign.html';
  }
}

// $(() => {
//   // ---------创建连接-----------
//   const socket = io();
//   // ----------设置昵称-------------
//   const userName = name;
//   $('#userName').text(name);
//   // 加入房间
//   socket.on('connect', () => {
//     socket.emit('join', userName);
//   });
//   // 暱稱重複
//   socket.on('loginFail', () => {
//     alert('重複登入聊天室');
//     window.close();
//   });
//   // 监听消息
//   socket.on('msg', (userName, msg) => {
//     const message = `${''
//   + '<div class="message">'
//   + '  <span class="user">'}${userName}: </span>`
//   + `  <span class="msg">${msg}</span>`
//   + '</div>';
//     $('#msglog').append(message);
//     // 滚动条保持最下方
//     $('#msglog').scrollTop($('#msglog')[0].scrollHeight);
//   });

//   // 监听系统消息
//   socket.on('sys', (sysMsg, users) => {
//     const message = `<div class="sysMsg">${sysMsg}</div>`;
//     $('#msglog').append(message);
//     if (users) {
//       $('#count').text(users.length);
//       $('#users').text(users);
//     }
//   });
//   // 接收對戰data
//   socket.on('PKdata', (playdate, playstock, finishdate, playIds) => {
//     let message = '<div class="sysMsg" style="color:grey">' + `當時日期：${playdate}` + '</div>';
//     $('#msglog').append(message);
//     const printStock = JSON.stringify(playstock);
//     message = '<div class="sysMsg" style="color:grey">' + `當時股票：${printStock}` + '</div>';
//     $('#msglog').append(message);
//     message = '<div class="sysMsg">' + `請${playIds[0]}, ${playIds[1]}點擊左上角首頁並開始遊戲` + '</div>';
//     $('#msglog').append(message);


//     if (playIds.indexOf(userName) !== -1) {
//       localStorage.setItem('playDate', playdate);
//       localStorage.setItem('playStock', printStock);
//       localStorage.setItem('finishDate', finishdate);
//       localStorage.removeItem('final_result');
//     }
//   });

//   // 发送消息
//   $('#messageInput').keydown(function (e) {
//     if (e.which === 13) {
//       e.preventDefault();
//       const msg = $(this).val();
//       $(this).val('');

//       socket.send(msg); // use message to receive
//     }
//   });

//   // 發起對戰
//   $('#beginPK').click(function () {
//     $(this).text('已發起對戰');
//     socket.send(`${userName} begin a battle`);
//     socket.emit('beginPK', userName);
//   });
// });
// // const socket = io();
// // socket.on('connectToRoom', (data) => {
// //   document.querySelector('#messages').innerHTML += `Hi, ${name} <br> `;
// //   document.querySelector('#messages').innerHTML += data;
// //   // document.write(data);
// // });
// // $('form').submit((e) => {
// //   e.preventDefault(); // prevents page reloading
// //   socket.emit('chat message', $('#m').val());
// //   $('#m').val('');
// //   return false;
// // });
// // socket.on('chat message', (msg) => {
// //   $('#messages').append($('<li>').text(msg));
// // });


function sign() {
  const token = localStorage.getItem('token');
  if (token) {
    window.location.href = 'profile.html';
  } else {
    window.location.href = 'sign.html';
  }
}
