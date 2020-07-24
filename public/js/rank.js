const final_result = JSON.parse(localStorage.getItem('final_result'));
let finishDate = parseInt(localStorage.getItem('finishDate'));
main();
async function main() {
  if (finishDate) {
    setInterval(countdown, 1000);
  }
  if (final_result) {
    const time_remain = document.querySelector('.time_remain');
    time_remain.innerHTML = '時間到， 結算';
    const main_nav = document.querySelector('.main-nav');
    console.log(main_nav);
    main_nav.innerHTML = `<li><a href="./result.html">最終結果</a></li>
      <li><a href="./rank.html">排行榜</a></li>
      <li><a href="#">最新新聞</a></li>
      <li><a href="#">最新財報</a></li>
      <img src="imgs/member.png" onclick = "sign()"/>`;
  }
  // get data from sql
  const rank = await fetch('api/1.0/stock/result', {
    method: 'GET',
  }).then((res) => res.json());

  const rank_table = document.querySelector('.rank_table');
  const rank_tbody = document.createElement('tbody');
  rank_table.appendChild(rank_tbody);

  for (let i = 0; i < rank.length; i++) {
    const row = document.createElement('tr');
    row.setAttribute('class', 'row');

    const rank_number = document.createElement('td');
    rank_number.innerHTML = i + 1;
    const name = document.createElement('td');
    name.innerHTML = rank[i].name;
    const totalmoney = document.createElement('td');
    totalmoney.innerHTML = rank[i].totalmoney;
    const invest_ratio = document.createElement('td');
    invest_ratio.innerHTML = rank[i].invest_ratio;
    const total_ratio = document.createElement('td');
    total_ratio.innerHTML = rank[i].total_ratio;
    const portfolio = document.createElement('td');
    if (!rank[i].portfolio) {
      // no finish game
      continue;
    }
    const portfolio_json = JSON.parse(rank[i].portfolio);
    // portfolio.innerHTML = rank[i].portfolio;
    for (let j = 0; j < portfolio_json.list.length; j++) {
      if (portfolio_json.list[j].buyShort_value == 'buy') {
        portfolio.innerHTML += `買進 ${portfolio_json.list[j].stock_name} 
        ${portfolio_json.list[j].qty} 張 <br>`;
        const ratio = ((portfolio_json.list[j].now_price_value
          - portfolio_json.list[j].price) / portfolio_json.list[j].price * 100).toFixed(2)
          * 100 / 100;
        portfolio.innerHTML += `報酬率：${ratio} %, `;
        const earn = (ratio * portfolio_json.list[j].total_price / 1000).toFixed(2) * 100 / 100;
        portfolio.innerHTML += `獲利： ${earn}  萬 <br>`;
      } else {
        portfolio.innerHTML += `放空 ${portfolio_json.list[j].stock_name} 
        ${portfolio_json.list[j].qty} 張 <br>`;
        const ratio = ((portfolio_json.list[j].now_price_value
          - portfolio_json.list[j].price) / portfolio_json.list[j].price * 100).toFixed(2)
          * 100 / 100 * (-1);
        portfolio.innerHTML += `報酬率：${ratio} %, `;
        const earn = (ratio * portfolio_json.list[j].total_price / 1000).toFixed(2) * 100 / 100;
        portfolio.innerHTML += `獲利： ${earn}  萬 <br>`;
      }
    }


    const playstock = document.createElement('td');
    const playstock_json = JSON.parse(rank[i].playstock);
    for (let j = 0; j < playstock_json.length; j++) {
      playstock.innerHTML += `${playstock_json[j].id} 
      ${playstock_json[j].stock} <br>(${playstock_json[j].industry})<br>`;
    }

    const playdate = document.createElement('td');
    playdate.innerHTML = rank[i].playdate;
    const finishdate = document.createElement('td');
    finishdate.innerHTML = getDateTime(parseInt(rank[i].finishdate));
    row.append(rank_number, name, totalmoney, invest_ratio,
      total_ratio, portfolio, playstock, playdate, finishdate);
    rank_tbody.appendChild(row);
  }
}



function sign() {
  const token = localStorage.getItem('token');
  if (token) {
    window.location.href = 'profile.html';
  } else {
    window.location.href = 'sign.html';
  }
}
