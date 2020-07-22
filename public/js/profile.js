if (!localStorage.getItem('token')) {
  alert('please sign up or sign in!');
  window.location.href = './sign.html';
} else {
  const bearer = `Bearer ${localStorage.getItem('token')}`;
  fetch('api/1.0/user/profile', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: bearer,
    },
    method: 'GET',
  }).then((res) => res.json())
    .then(result => {
      if (result.status === 403) {
        alert('Invalid acess, please sign up or sign in!');
        localStorage.removeItem('token');
        //window.location.href = './sign.html';
      } else {
        const hello = document.createElement('h3');
        hello.innerHTML = `Hello, ${result.data.name}`;
        const name = document.querySelector('.username');
        name.appendChild(hello);
        const userEmail = document.createElement('h3');
        userEmail.innerHTML = `Your Email: ${result.data.email}`;
        const email = document.querySelector('.email');
        email.appendChild(userEmail);
      }
    });
}

function logOut() {
  localStorage.removeItem('token');
  localStorage.removeItem('name');
  localStorage.removeItem('playDate');
  localStorage.removeItem('playStock');
  window.location.href = './';
}
function sign() {
  let token = localStorage.getItem('token');
  if (token) {
    window.location.href = 'profile.html';
  } else {
    window.location.href = 'sign.html';
  }
}