
function sign() {
  const token = localStorage.getItem('token');
  if (token) {
    window.location.href = 'profile.html';
  } else {
    window.location.href = 'sign.html';
  }
}

function getDate(date) {
  const fullDate = new Date(date);
  const yy = fullDate.getFullYear();
  const mm = fullDate.getMonth() + 1 <= 9 ? `0${fullDate.getMonth() + 1}` : fullDate.getMonth() + 1;
  const dd = fullDate.getDate() < 10 ? (`0${fullDate.getDate()}`) : fullDate.getDate();
  const today = `${yy}-${mm}-${dd}`;
  return today;
}

function getDateTime(date) {
  const fullDate = new Date(date);
  const yy = fullDate.getFullYear();
  const mm = fullDate.getMonth() + 1 <= 9 ? `0${fullDate.getMonth() + 1}` : fullDate.getMonth() + 1;
  const dd = fullDate.getDate() < 10 ? (`0${fullDate.getDate()}`) : fullDate.getDate();
  const hr = fullDate.getHours() < 10 ? (`0${fullDate.getHours()}`) : fullDate.getHours();
  const min = fullDate.getMinutes() < 10 ? (`0${fullDate.getMinutes()}`) : fullDate.getMinutes();
  const sec = fullDate.getSeconds() < 10 ? (`0${fullDate.getSeconds()}`) : fullDate.getSeconds();
  const today = `${yy}-${mm}-${dd} <br>${hr}:${min}:${sec}`;
  return today;
}


async function countdown() {
  const time_remain = document.querySelector('.time_remain');
  const now = Date.now();
  const time_remain_value = finishDate + 15 * 60 * 1000 - now;

  let min = Math.floor(time_remain_value / 1000 / 60);
  if (parseInt(min) < 0) {
    time_remain.innerHTML = `時間到， 結算`;
    window.location.href = 'result.html';
  } else {
    min = min < 10 ? (`0${min}`) : min;
    let sec = Math.floor(time_remain_value / 1000 % 60);
    sec = sec < 10 ? (`0${sec}`) : sec;
    time_remain.innerHTML = `時間剩下 ${min}:${sec}`;
  }
}