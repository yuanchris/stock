main();
async function main() {
  // get data from sql
  const rank = await fetch('api/1.0/stock/result', {
    method: 'GET',
  }).then((res) => res.json());
  // console.log(rank);
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
    portfolio_json = JSON.parse(rank[i].portfolio);
    // portfolio.innerHTML = rank[i].portfolio;
    for (let j = 0; j < portfolio_json.list.length; j++) {
      if (portfolio_json.list[j].buyShort_value == "buy") {
        portfolio.innerHTML += `買進 ${portfolio_json.list[j].stock_id} 
        ${portfolio_json.list[j].qty} 張 <br>`;
      }
      else {
        portfolio.innerHTML += `放空 ${portfolio_json.list[j].stock_id} 
        ${portfolio_json.list[j].qty} 張 <br>`;
      }
    }


    const playstock = document.createElement('td');
    let playstock_json = JSON.parse(rank[i].playstock);
    for (let j = 0; j < playstock_json.length; j++) {
      playstock.innerHTML += `${playstock_json[j].id} 
      ${playstock_json[j].stock} <br>(${playstock_json[j].industry})<br>`
    }

    const playdate = document.createElement('td');
    playdate.innerHTML = rank[i].playdate;
    const finishdate = document.createElement('td');
    finishdate.innerHTML = rank[i].finishdate;
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