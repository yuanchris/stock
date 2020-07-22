/* =================================
random stock
==================================== */
let playDate = localStorage.getItem('playDate');
let playStock = JSON.parse(localStorage.getItem('playStock'));
let token = localStorage.getItem('token');
let name = localStorage.getItem('name');
const pickstock = document.querySelector('div.pickstock');

if (playDate && playStock) {
  pickstock.innerHTML = `<h3>Your start date is :</h3><p>${playDate}</p> <br>\
<h3>Your stocks is :</h3>`;
  for (let i = 0; i < 5; i++) {
    pickstock.innerHTML += `<p>${playStock[i].id} ` + `${playStock[i].stock} `
  + `${playStock[i].industry}</p>`;
  }
  pickstock.innerHTML += '<h3>Have a Good Time!</h3>';
}



pickstock.addEventListener('click', async () => {
  playDate = localStorage.getItem('playDate');
  playStock = JSON.parse(localStorage.getItem('playStock'));
  if (!(token || name)) {
    swal('please login in first!', '請點擊登入');
    return;
  }
  if (playDate && playStock) {
    swal('遊戲已經開始', '請往上點擊投資組合');
  } else {
    const stock = await fetch('api/1.0/stock/info')
      .then((res) => res.json());
    let randomStock = new Set([Math.floor(Math.random() * 140), Math.floor(Math.random() * 140),
      Math.floor(Math.random() * 140), Math.floor(Math.random() * 140),
      Math.floor(Math.random() * 140)]);
    randomStock = [...randomStock];
    while (randomStock.length !== 5) {
      randomStock = new Set([Math.floor(Math.random() * 140), Math.floor(Math.random() * 140),
        Math.floor(Math.random() * 140), Math.floor(Math.random() * 140),
        Math.floor(Math.random() * 140)]);
      randomStock = [...randomStock];
    }
    randomStock.sort((a, b) => a - b);
    const randomPlayDate = formatDate(randomDate());
    const randomPlayStock = [];
    for (let i = 0; i < 5; i++) {
      randomPlayStock[i] = {};
      randomPlayStock[i].id = stock[randomStock[i]].id;
      randomPlayStock[i].stock = stock[randomStock[i]].stock;
      randomPlayStock[i].industry = stock[randomStock[i]].industry;
    }
    pickstock.innerHTML = `<h3>Your start date is :</h3><p>${randomPlayDate}</p> <br>\
  <h3>Your stocks is :</h3>`;

    for (let i = 0; i < 5; i++) {
      pickstock.innerHTML += `<p>${randomPlayStock[i].id} ` + `${randomPlayStock[i].stock} `
    + `${randomPlayStock[i].industry}</p>`;
    }
    pickstock.innerHTML += '<h3>Have a Good Time!</h3>';

    localStorage.setItem('playDate', randomPlayDate);
    localStorage.setItem('playStock', JSON.stringify(randomPlayStock));
    // window.location.reload();
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
