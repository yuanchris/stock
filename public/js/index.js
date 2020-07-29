/* =================================
random stock
==================================== */
let playDate = localStorage.getItem('playDate');
let playStock = JSON.parse(localStorage.getItem('playStock'));
const token = localStorage.getItem('token');
const name = localStorage.getItem('name');
const pickstock = document.querySelector('div.pickstock');
const nav_start = document.querySelector('#start');
let finishDate = parseInt(localStorage.getItem('finishDate'));

if (playDate && playStock) {
  pickstock.innerHTML = `<h3>Your start date is :</h3><p>${playDate}</p> <br>\
<h3>Your stocks is :</h3>`;
  for (let i = 0; i < 5; i++) {
    pickstock.innerHTML += `<p>${playStock[i].id} ` + `${playStock[i].stock} `
  + `${playStock[i].industry}</p>`;
  }
  pickstock.innerHTML += '<h3>Have a Good Time!</h3>';
  nav_start.setAttribute('style', 'display:none');
  setInterval(countdown, 1000);
}


async function start() {
  function abc(e) {
    e.preventDefault();
    window.location.href = './index.html';
  }
  Swal.fire({
    title: '開始對戰',
    text: '選擇遊戲方式',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    confirmButtonText: '單人遊戲',
    cancelButtonColor: '#24b400',
    cancelButtonText: '連線對戰',
    showCloseButton: true,
  }).then(async (result) => {
    if (result.value) { // 單人
      playDate = localStorage.getItem('playDate');
      playStock = JSON.parse(localStorage.getItem('playStock'));
      finishDate = parseInt(localStorage.getItem('finishDate'));
      if (!(token && name)) {
        Swal.fire('please login in first!', '請點擊登入');
        return;
      }
      if (playDate && playStock) {
        Swal.fire('遊戲已經開始', '請點擊投資組合');
      } else {
        let timerInterval;
        Swal.fire({
          title: '數據載入中',
          timer: 2000,
          timerProgressBar: true,
          onBeforeOpen: () => {
            Swal.showLoading();
          },
          onClose: () => {
            clearInterval(timerInterval);
          },
        });
        const start = await fetch(`api/1.0/stock/start?name=${name}`, {
          method: 'GET',
        }).then((res) => res.json());
        start.playstock = JSON.parse(start.playstock);
        Swal.fire({
          title: '遊戲開始',
          html: `Your start date is : ${start.playdate} <br><br>
          Your stocks are :
          <p>${start.playstock[0].id} ${start.playstock[0].stock} ${start.playstock[0].industry}</p>
          <p>${start.playstock[1].id} ${start.playstock[1].stock} ${start.playstock[1].industry}</p>
          <p>${start.playstock[2].id} ${start.playstock[2].stock} ${start.playstock[2].industry}</p>
          <p>${start.playstock[3].id} ${start.playstock[3].stock} ${start.playstock[3].industry}</p>
          <p>${start.playstock[4].id} ${start.playstock[4].stock} ${start.playstock[4].industry}</p>
          <br><br>
          請點擊「投資組合」開始遊戲！`,
        });


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
        nav_start.setAttribute('style', 'display:none');

        setInterval(countdown, 1000);
      }
    } else if (result.dismiss == 'cancel') {
      window.location.href = './match.html';
    }
  });
}


// pickstock.addEventListener('click', async () => {
//   playDate = localStorage.getItem('playDate');
//   playStock = JSON.parse(localStorage.getItem('playStock'));
//   finishDate = parseInt(localStorage.getItem('finishDate'));
//   if (!(token && name)) {
//     swal('please login in first!', '請點擊登入');
//     return;
//   }
//   if (playDate && playStock) {
//     swal('遊戲已經開始', '請往上點擊投資組合');
//   } else {
//     const start = await fetch(`api/1.0/stock/start?name=${name}`, {
//       method: 'GET',
//     }).then((res) => res.json());
//     start.playstock = JSON.parse(start.playstock);
//     pickstock.innerHTML = `<h3>Your start date is :</h3><p>${start.playdate}</p> <br>\
//       <h3>Your stocks is :</h3>`;

//     for (let i = 0; i < 5; i++) {
//       pickstock.innerHTML += `<p>${start.playstock[i].id} ` + `${start.playstock[i].stock} `
//     + `${start.playstock[i].industry}</p>`;
//     }
//     pickstock.innerHTML += '<h3>Have a Good Time!</h3>';
//     localStorage.setItem('playDate', start.playdate);
//     localStorage.setItem('playStock', JSON.stringify(start.playstock));
//     localStorage.setItem('finishDate', start.finishdate);
//     localStorage.removeItem('final_result');
//     finishDate = parseInt(localStorage.getItem('finishDate'));
//     setInterval(countdown, 1000);
//   }
// });


// function


function randomDate() {
  const startDate = new Date(2014, 0, 1).getTime();
  const endDate = new Date(2019, 9, 1).getTime();
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
