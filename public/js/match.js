
main();
async function main() {
  if (!name) {
    await swal('請先登入');
    window.location.href = 'sign.html';
  }
}


$(() => {
  // ---------创建连接-----------
  const socket = io();
  // ----------设置昵称-------------
  const userName = name;
  $('#userName').text(name);
  // 加入房间
  socket.on('connect', () => {
    socket.emit('join', userName);
  });
  // 暱稱重複
  socket.on('loginFail', () => {
    alert('重複登入聊天室');
    window.close();
  });

  // 监听系统消息
  socket.on('list', (sysMsg, users) => {
    console.log(users);
    if (users) {

      for (const key in users) {
        console.log($(`span#${key}`));
        $(`#${key} span`).text(`房內人數：${users[key].length}`);
      }
      // $('#count').text(users.length);
      // $('#users').text(users);
    }
  });
});
