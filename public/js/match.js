const name = localStorage.getItem('name');

// const socket = io();
// socket.on('connectToRoom', (data) => {
//   document.querySelector('#messages').innerHTML += `Hi, ${name} <br> `;
//   document.querySelector('#messages').innerHTML += data;
//   // document.write(data);
// });
// $('form').submit((e) => {
//   e.preventDefault(); // prevents page reloading
//   socket.emit('chat message', $('#m').val());
//   $('#m').val('');
//   return false;
// });
// socket.on('chat message', (msg) => {
//   $('#messages').append($('<li>').text(msg));
// });


function sign() {
  const token = localStorage.getItem('token');
  if (token) {
    window.location.href = 'profile.html';
  } else {
    window.location.href = 'sign.html';
  }
}
