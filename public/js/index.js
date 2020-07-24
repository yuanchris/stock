/* =================================
random stock
==================================== */
let playDate = localStorage.getItem('playDate');
let playStock = JSON.parse(localStorage.getItem('playStock'));
let token = localStorage.getItem('token');
let name = localStorage.getItem('name');
const pickstock = document.querySelector('div.pickstock');
let finishDate = parseInt(localStorage.getItem('finishDate'));

if (playDate && playStock) {
  pickstock.innerHTML = `<h3>Your start date is :</h3><p>${playDate}</p> <br>\
<h3>Your stocks is :</h3>`;
  for (let i = 0; i < 5; i++) {
    pickstock.innerHTML += `<p>${playStock[i].id} ` + `${playStock[i].stock} `
  + `${playStock[i].industry}</p>`;
  }
  pickstock.innerHTML += '<h3>Have a Good Time!</h3>';
  setInterval(countdown, 1000);
}





pickstock.addEventListener('click', async () => {
  playDate = localStorage.getItem('playDate');
  playStock = JSON.parse(localStorage.getItem('playStock'));
  finishDate = parseInt(localStorage.getItem('finishDate'));
  if (!(token && name)) {
    swal('please login in first!', '請點擊登入');
    return;
  }
  if (playDate && playStock) {
    swal('遊戲已經開始', '請往上點擊投資組合');
  } else {
    const start = await fetch(`api/1.0/stock/start?name=${name}`, {
      method: 'GET',
    }).then((res) => res.json());
    start.playstock = JSON.parse(start.playstock);
    pickstock.innerHTML = `<h3>Your start date is :</h3><p>${start.playdate}</p> <br>\
      <h3>Your stocks is :</h3>`;

    for (let i = 0; i < 5; i++) {
      pickstock.innerHTML += `<p>${start.playstock[i].id} ` + `${start.playstock[i].stock} `
    + `${start.playstock[i].industry}</p>`;
    }
    pickstock.innerHTML += '<h3>Have a Good Time!</h3>';
    localStorage.setItem('playDate', start.playdate);
    localStorage.setItem('playStock', JSON.stringify(start.playstock));
    localStorage.setItem('finishDate', start.finishdate);
    localStorage.removeItem('final_result');
    finishDate = parseInt(localStorage.getItem('finishDate'));
    setInterval(countdown, 1000);
  }
});


// function


function randomDate() {
  const startDate = new Date(2014, 0, 1).getTime();
  const endDate = new Date(2020, 1, 1).getTime();
  const spaces = (endDate - startDate);
  let timestamp = Math.round(Math.random() * spaces);
  timestamp += startDate;
  return new Date(timestamp);
}
function formatDate(date) {
  let month = randomDate().getMonth() + 1;
  let day = randomDate().getDate();
  month = month < 10 ? `0${month}` : month;
  day = day < 10 ? `0${day}` : day;
  return `${String(date.getFullYear())}-${month}-${day}`;
}

function sign() {
  const token = localStorage.getItem('token');
  if (token) {
    window.location.href = 'profile.html';
  } else {
    window.location.href = 'sign.html';
  }
}


/* =================================
 hidden content
==================================== */

// const hiddenContent = document.querySelectorAll('.below');
// const show = document.querySelector('.show');

// show.addEventListener('click', () => {
//     for (let i = 0; i< hiddenContent.length; i++)
//     hiddenContent[i].style.display = "flex";
//   });
