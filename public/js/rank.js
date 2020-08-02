const final_result = JSON.parse(localStorage.getItem('final_result'));
const finishDate = parseInt(localStorage.getItem('finishDate'));
main();
async function main() {
  if (finishDate) {
    setInterval(countdown, 1000);
  }
  if (final_result) {
    const time_remain = document.querySelector('.time_remain');
    time_remain.innerHTML = '時間到， 結算';
    const main_nav = document.querySelector('.main-nav');
    main_nav.innerHTML = `<li><a href="./result.html">最終結果</a></li>
      <li><a href="./rank.html">排行榜</a></li>
      <li><a href="./resultnews.html">最新新聞</a></li>
      <li><a href="./resultreport.html">最新財報</a></li>
      <li id='leave'><a onclick= "leave()">結束遊戲</a></li>
      <li id="member_name"></li>
      <img src="imgs/member.png" onclick = "sign()"/>`;
    if (name) {
      const member_name = document.querySelector('#member_name');
      member_name.innerHTML = name;
    }
  }
  // get data from sql
  const rank = await fetch('api/1.0/stock/result', {
    method: 'GET',
  }).then((res) => res.json());

  const rank_table = document.querySelector('.rank_table');
  const rank_tbody = document.createElement('tbody');
  rank_table.appendChild(rank_tbody);

  for (let i = 0; i < rank.length; i++) {
    if (!rank[i].portfolio) {
      // no finish game
      continue;
    }
    const portfolio_json = JSON.parse(rank[i].portfolio);
    const row = document.createElement('tr');
    row.setAttribute('class', 'row');

    const rank_number = document.createElement('td');
    rank_number.innerHTML = i + 1;
    const rank_name = document.createElement('td');
    rank_name.innerHTML = rank[i].name;
    const totalmoney = document.createElement('td');
    totalmoney.innerHTML = rank[i].totalmoney;
    const total_ratio = document.createElement('td');
    total_ratio.innerHTML = `${rank[i].total_ratio} %`;

    const invest_total = document.createElement('td');
    invest_total.innerHTML = (portfolio_json.total / 10).toFixed(3) * 1000 / 1000;

    const invest_ratio = document.createElement('td');
    invest_ratio.innerHTML = `${rank[i].invest_ratio} %`;

    const portfolio = document.createElement('td');
    portfolio.setAttribute('class', 'portfolio');

    // portfolio.innerHTML = rank[i].portfolio;
    for (let j = 0; j < portfolio_json.list.length; j++) {
      if (portfolio_json.list[j].buyShort_value == 'buy') {
        portfolio.innerHTML += `買進 ${portfolio_json.list[j].stock_name} 
        ${portfolio_json.list[j].qty} 張，成本 ${(portfolio_json.list[j].total_price / 10).toFixed(3) * 1000 / 1000} 萬<br>`;
        const ratio = ((portfolio_json.list[j].now_price_value
          - portfolio_json.list[j].price) / portfolio_json.list[j].price * 100).toFixed(2)
          * 100 / 100;
        if (ratio > 0) {
          portfolio.innerHTML += `報酬率：<span style="color:red">${ratio}</span> %， `;
        } else if (ratio < 0) {
          portfolio.innerHTML += `報酬率：<span style="color:green">${ratio}</span> %， `;
        }

        const earn = (ratio * portfolio_json.list[j].total_price / 1000).toFixed(2) * 100 / 100;
        portfolio.innerHTML += `獲利： ${earn}  萬 <br>`;
      } else {
        portfolio.innerHTML += `放空 ${portfolio_json.list[j].stock_name} 
        ${portfolio_json.list[j].qty} 張，成本 ${(portfolio_json.list[j].total_price / 10).toFixed(3) * 1000 / 1000} 萬<br>`;
        const ratio = ((portfolio_json.list[j].now_price_value
          - portfolio_json.list[j].price) / portfolio_json.list[j].price * 100).toFixed(2)
          * 100 / 100 * (-1);
        if (ratio > 0) {
          portfolio.innerHTML += `報酬率：<span style="color:red">${ratio}</span> %， `;
        } else if (ratio < 0) {
          portfolio.innerHTML += `報酬率：<span style="color:green">${ratio}</span> %， `;
        }
        const earn = (ratio * portfolio_json.list[j].total_price / 1000).toFixed(2) * 100 / 100;
        portfolio.innerHTML += `獲利： ${earn}  萬 <br>`;
      }
    }


    const playstock = document.createElement('td');
    const playstock_json = JSON.parse(rank[i].playstock);
    for (let j = 0; j < playstock_json.length; j++) {
      playstock.innerHTML += `${playstock_json[j].id} 
      ${playstock_json[j].stock} <br>`;
    }

    const playdate = document.createElement('td');
    playdate.innerHTML = rank[i].playdate;
    const finishdate = document.createElement('td');
    finishdate.innerHTML = getDateTime(parseInt(rank[i].finishdate));
    row.append(rank_number, rank_name, totalmoney, total_ratio, invest_total, invest_ratio,
      portfolio, playstock, playdate, finishdate);
    rank_tbody.appendChild(row);
  }
  highlightKeyword(name);
}


// 搜索关键字高亮
function highlightKeyword(keyword) {
  // 1.获取要高亮显示的行
  const rowNode = $('.row');
  // 2.获取搜索的内容
  // 3.遍历整行内容，添加高亮颜色
  rowNode.each(function () {
    let newHtml = $(this).html();
    const re = new RegExp(keyword, 'g');
    newHtml = newHtml.replace(re, `<span style="color:#ff6700">${keyword}</span>`);
    $(this).html(newHtml);
  });
}
