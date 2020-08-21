/* =================================
random stock
==================================== */
let playDate = localStorage.getItem('playDate');
let playStock = JSON.parse(localStorage.getItem('playStock'));
const token = localStorage.getItem('token');
const pickstock = document.querySelector('div.pickstock');
const nav_start = document.querySelector('#start');
let finishDate = parseInt(localStorage.getItem('finishDate'));

if (playDate && playStock) {
  pickstock.innerHTML = `<h3>你的開始日期</h3><p>${playDate}</p> <br>\
<h3>你的遊戲股票</h3>`;
  for (let i = 0; i < 5; i++) {
    pickstock.innerHTML += `<p>${playStock[i].id} ` + `${playStock[i].stock} `
  + `${playStock[i].industry}</p>`;
  }
  pickstock.innerHTML += '<h3>祝 玩得開心！</h3>';
  nav_start.setAttribute('style', 'display:none');
  setInterval(countdown, 1000);
}
main();
async function main() {
  const visualArr = document.querySelectorAll('.visual');

  visualArr[1].setAttribute('class', 'visual current');
  const index = { num: 1 };
  const show = setInterval(() => {
    next(index, visualArr);
  }, 4000);
}

function next(index, visualArr) {
  (index.num == visualArr.length - 1) ? index.num = 0 : index.num += 1;
  change(visualArr, 'visual current', 'visual', index.num);
}

function change(arr, clsCur, cls, num) {
  for (let i = 0; i < arr.length; i++) {
    if (i == num) {
      arr[i].setAttribute('class', clsCur);
    } else {
      arr[i].setAttribute('class', cls);
    }
  }
}

async function start() {
  // function abc(e) {
  //   e.preventDefault();
  //   window.location.href = './index.html';
  // }
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
        Swal.fire('please login in first!', '請點擊登入')
          .then((res) => { window.location.href = './sign.html'; });
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
          html: `你的開始日期：${start.playdate} <br><br>
          你的遊戲股票：
          <p>${start.playstock[0].id} ${start.playstock[0].stock} ${start.playstock[0].industry}</p>
          <p>${start.playstock[1].id} ${start.playstock[1].stock} ${start.playstock[1].industry}</p>
          <p>${start.playstock[2].id} ${start.playstock[2].stock} ${start.playstock[2].industry}</p>
          <p>${start.playstock[3].id} ${start.playstock[3].stock} ${start.playstock[3].industry}</p>
          <p>${start.playstock[4].id} ${start.playstock[4].stock} ${start.playstock[4].industry}</p>
          <br><br>
          請點擊「投資選擇」開始遊戲！`,
        });

        pickstock.innerHTML = `<h3>你的開始日期</h3><p>${start.playdate}</p> <br>\
        <h3>你的遊戲股票</h3>`;
        for (let i = 0; i < 5; i++) {
          pickstock.innerHTML += `<p>${start.playstock[i].id} ` + `${start.playstock[i].stock} `
        + `${start.playstock[i].industry}</p>`;
        }
        pickstock.innerHTML += '<h3>祝 玩得開心！</h3>';
        localStorage.setItem('playDate', start.playdate);
        localStorage.setItem('playStock', JSON.stringify(start.playstock));
        localStorage.setItem('finishDate', start.finishdate);
        localStorage.removeItem('final_result');
        finishDate = parseInt(localStorage.getItem('finishDate'));
        nav_start.setAttribute('style', 'display:none');
        setInterval(countdown, 1000);
      }
    } else if (result.dismiss === 'cancel') {
      window.location.href = './match.html';
    }
  });
}


// Wrap every letter in a span
// var textWrapper = document.querySelector('.ml9 .letters');
// textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

// anime.timeline({loop: true})
//   .add({
//     targets: '.ml9 .letter',
//     scale: [0, 1],
//     duration: 1500,
//     elasticity: 600,
//     delay: (el, i) => 45 * (i+1)
//   }).add({
//     targets: '.ml9',
//     opacity: 0,
//     duration: 1000,
//     easing: "easeOutExpo",
//     delay: 1000
//   });
