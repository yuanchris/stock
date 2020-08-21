/* eslint-disable camelcase */
/* eslint-disable no-await-in-loop */
const list = document.querySelector('#stock-list');
const playDate = localStorage.getItem('playDate');
const playStock = JSON.parse(localStorage.getItem('playStock'));
let portfolio = JSON.parse(localStorage.getItem('portfolio'));
const finishDate = parseInt(localStorage.getItem('finishDate'));
// console.log(portfolio);
if (!portfolio) {
  portfolio = {};
  portfolio.list = [];
  // localStorage.setItem('portfolio', JSON.stringify(portfolio));
}

main();
async function main() {
  if (!(playDate && playStock)) {
    const wait = document.querySelector('#wait');
    wait.innerHTML = '<h2>你的遊戲還未開始</h2>';
    Swal.fire('你的遊戲還未開始，請點擊「開始遊戲」')
      .then(() => { window.location.href = '/index.html'; });
  } else {
    setInterval(countdown, 1000);
    const post = { playDate, playStock };
    // console.log(post);
    const stockPrice = await fetch('api/1.0/stock/price', {
      method: 'POST',
      body: JSON.stringify(post),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => (res.json()));
    const stockPriceGroup = _.groupBy(stockPrice, 'stock');
    const wait = document.querySelector('#wait');
    wait.innerHTML = '';
    const nowDate = document.querySelector('#nowDate');
    nowDate.innerHTML = `<h3>你的開始日期： ${playDate}</h3>`;

    updateTotal();

    const submit_div = document.querySelector('#button');
    const submit_button = document.createElement('button');
    submit_button.setAttribute('id', 'submit');
    submit_button.setAttribute('href', 'submit');
    submit_button.setAttribute('onclick', 'result()');
    submit_button.innerHTML = '提早交卷';
    submit_div.appendChild(submit_button);
    list.appendChild(submit_div);


    for (let i = 0; i < playStock.length; i++) {
      const row = document.createElement('div');
      row.setAttribute('class', 'row');
      row.innerHTML = `<h3>${playStock[i].id} ${playStock[i].stock} (${playStock[i].industry})</h3>`;
      const price_curve = document.createElement('div');

      const details = document.createElement('div');
      details.setAttribute('class', 'details');

      // curve
      price_curve.setAttribute('class', `curve${i}`);
      details.appendChild(price_curve);

      // item
      const item = document.createElement('div');
      item.setAttribute('class', 'item');

      const now_price = document.createElement('div');
      now_price.setAttribute('class', 'now_price');
      now_price.innerHTML = `今日股價： 
        ${stockPriceGroup[playStock[i].id][0].price}`;
      item.appendChild(now_price);

      const select = document.createElement('div');
      select.setAttribute('class', 'select');
      select.setAttribute('id', `selectDiv${i}`);
      select.setAttribute('onchange', 'changeSelect(this.id)');
      const buy = document.createElement('input');
      buy.setAttribute('type', 'radio');
      buy.setAttribute('id', 'buy');
      buy.setAttribute('name', `select${i}`);
      buy.setAttribute('value', 'buy');
      buy.setAttribute('checked', 'checked');
      const buy_label = document.createElement('label');
      buy_label.setAttribute('for', 'buy');
      buy_label.innerHTML = '買進';
      const short = document.createElement('input');
      short.setAttribute('type', 'radio');
      short.setAttribute('id', 'short');
      short.setAttribute('name', `select${i}`);
      short.setAttribute('value', 'short');
      const short_label = document.createElement('label');
      short_label.setAttribute('for', 'short');
      short_label.innerHTML = '放空';
      select.appendChild(buy);
      select.appendChild(buy_label);
      select.appendChild(short);
      select.appendChild(short_label);
      item.appendChild(select);

      const qty = document.createElement('div');
      qty.setAttribute('class', 'qty');
      const qty_label = document.createElement('label');
      qty_label.setAttribute('for', `qty${i}`);
      qty_label.innerHTML = '數量(張)：';
      const qty_input = document.createElement('input');
      qty_input.setAttribute('type', 'number');
      qty_input.setAttribute('min', 0);
      qty_input.setAttribute('id', `qty${i}`);
      const storage = portfolio.list.find((x) => {
        if (x.stock_id == playStock[i].id) {
          return x;
        }
      });
      if (storage) {
        qty_input.setAttribute('value', storage.qty);
        if (storage.buyShort_value == 'buy') {
          buy.setAttribute('checked', 'checked');
        } else {
          short.setAttribute('checked', 'checked');
        }
      }
      qty_input.setAttribute('placeholder', '輸入張數');
      qty_input.setAttribute('onchange', 'changeQty(this.id)');
      qty.appendChild(qty_label);
      qty.appendChild(qty_input);
      item.appendChild(qty);

      const price = document.createElement('div');
      price.setAttribute('class', 'price');
      if (storage) {
        price.innerHTML = `小計(TWD)：
          ${(storage.total_price / 10).toFixed(3) * 1000 / 1000} 萬`;
      } else {
        price.innerHTML = '小計(TWD)： 0 萬';
      }
      item.appendChild(price);
      details.appendChild(item);
      row.appendChild(details);
      list.appendChild(row);
      plot2(stockPriceGroup[playStock[i].id], `curve${i}`);
    }
  }
}
function changeSelect(id) {
  const selector = document.getElementById(id);
  const qty_input = selector.parentElement.parentElement.querySelector('.qty input');
  // console.log(qty_input);
  changeQty(qty_input.id);
}


function changeQty(id) {
  const selector = document.getElementById(id);
  let qty = document.getElementById(id).value;
  if (qty < 0) {
    Swal.fire('張數不能小於0');
    qty = 0;
    return;
  }
  let price = selector.parentElement.parentElement
    .querySelector('.now_price').innerHTML.split('：')[1];
  price = parseFloat(price);
  // console.log(price);
  const stock_id = selector.parentElement.parentElement.parentElement
    .parentElement.querySelector('h3').innerHTML.split(' ')[0];
  const stock_name = selector.parentElement.parentElement.parentElement
    .parentElement.querySelector('h3').innerHTML.split(' ')[1];
  const total_price = (qty * price).toFixed(3) * 1000 / 1000;

  const subtotal_item = selector.parentElement
    .parentElement.querySelector('.price');
  subtotal_item.innerHTML = `小計(TWD)：
     ${(total_price / 10).toFixed(3) * 1000 / 1000} 萬`;

  const buyShort = selector.parentElement.parentElement
    .querySelectorAll('[type="radio"]');
  let buyShort_value;
  for (let i = 0; i < buyShort.length; i++) {
    if (buyShort[i].checked) {
      buyShort_value = buyShort[i].value;
      break;
    }
  }
  const duplicate = portfolio.list.find((item) => {
    if (item.stock_id == stock_id) {
      return item;
    } return false;
  });
  if (duplicate) {
    duplicate.qty = qty;
    duplicate.total_price = total_price;
    duplicate.buyShort_value = buyShort_value;
  } else {
    portfolio.list.push({
      stock_id, stock_name, price, qty, total_price, buyShort_value,
    });
  }
  let invest_total = 0;
  for (let i = 0; i < portfolio.list.length; i++) {
    invest_total += portfolio.list[i].total_price;
  }
  portfolio.total = invest_total.toFixed(3) * 1000 / 1000;
  // buy or short


  localStorage.setItem('portfolio', JSON.stringify(portfolio));
  // console.log(qty);
  // console.log(price);
  // console.log(stock_id);
  updateTotal();
}

function updateTotal() {
  const invest_total_item = document.querySelector('#invest_total');
  const left_money = document.querySelector('#left_money');
  if (portfolio.total) {
    invest_total_item.innerHTML = `目前投資金額(TWD)： 
       ${(portfolio.total / 10).toFixed(3) * 1000 / 1000} 萬`;
    left_money.innerHTML = `剩餘金額(TWD)：
      ${(2000 - portfolio.total / 10).toFixed(3) * 1000 / 1000} 萬`;
  } else {
    invest_total_item.innerHTML = `目前投資金額(TWD)： ${0} 萬`;
    left_money.innerHTML = `剩餘金額(TWD)：${2000} 萬`;
  }
  if (portfolio.total / 10 > 2000) {
    Swal.fire('投資金額大於上限(2000萬)', '請修改投資組合');
  }
}

function result() {
  if (portfolio.total / 10 > 2000) {
    Swal.fire('投資金額大於上限(2000萬)', '請修改投資組合');
    return;
  }
  // let yes =
  Swal.fire({
    title: '你確定要提早交卷嗎？',
    text: '不能更改了哦',
    icon: 'warning',
    showCancelButton: true,
  }).then((value) => {
    if (value.value) {
      window.location.href = '/result.html';
    }
  });
  // if (yes) {
  //   window.location.href="/result.html";
  // }
}


// plot
async function plot2(stockPrice, curve_class) {
  const margin = {
    top: 20, right: 50, bottom: 30, left: 60,
  };
  const width = 960 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  // 設定時間格式
  const parseDate = d3.timeParse('%Y-%m-%d');

  // K線圖的x
  const x = techan.scale.financetime()
    .range([0, width]);
  const crosshairY = d3.scaleLinear()
    .range([height, 0]);
  // K線圖的y
  const y = d3.scaleLinear()
    .range([height - 60, 0]);
  // 成交量的y
  const yVolume = d3.scaleLinear()
    .range([height, height - 60]);
  // 成交量的x
  const xScale = d3.scaleBand().range([0, width]).padding(0.15);

  const sma0 = techan.plot.sma()
    .xScale(x)
    .yScale(y);

  const sma1 = techan.plot.sma()
    .xScale(x)
    .yScale(y);
  const ema2 = techan.plot.ema()
    .xScale(x)
    .yScale(y);
  const candlestick = techan.plot.candlestick()
    .xScale(x)
    .yScale(y);

  const zoom = d3.zoom()
    .scaleExtent([1, 5]) // 設定縮放大小1 ~ 5倍
    .translateExtent([[0, 0], [width, height]]) // 設定可以縮放的範圍，註解掉就可以任意拖曳
    .extent([[margin.left, margin.top], [width, height]])
    .on('zoom', zoomed);

  let zoomableInit;

  const xAxis = d3.axisBottom()
    .scale(x);

  const yAxis = d3.axisLeft()
    .scale(y);

  const volumeAxis = d3.axisLeft(yVolume)
    .ticks(4)
    .tickFormat(d3.format(',.3s'));
  const ohlcAnnotation = techan.plot.axisannotation()
    .axis(yAxis)
    .orient('left')
    .format(d3.format(',.2f'));

  const timeAnnotation = techan.plot.axisannotation()
    .axis(xAxis)
    .orient('bottom')
    .format(d3.timeFormat('%Y-%m-%d'))
    .translate([0, height])
    .width(90);


  // 設定十字線
  const crosshair = techan.plot.crosshair()
    .xScale(x)
    .yScale(crosshairY)
    .xAnnotation(timeAnnotation)
    .yAnnotation(ohlcAnnotation)
    .on('move', move);

  // 設定文字區域
  const textSvg = d3.select(`.${curve_class}`).append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  // 設定顯示文字，web版滑鼠拖曳就會顯示，App上則是要點擊才會顯示
  const svgText = textSvg.append('g')
    .attr('class', 'description')
    .append('text')
  //            .attr("x", margin.left)
    .attr('y', 6)
    .attr('dy', '.71em')
    .style('text-anchor', 'start')
    .text('');
  // 設定畫圖區域
  const svg = d3.select(`.${curve_class}`)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .attr('pointer-events', 'all')
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);


  let dataArr;

  svg.selectAll('*').remove(); // 切換不同資料需要重新畫圖，因此需要先清除原先的圖案

  const accessor = candlestick.accessor();


  const data = stockPrice.map((d) => ({
    date: parseDate(d.time),
    open: +d.open,
    high: +d.high,
    low: +d.low,
    close: +d.price,
    volume: +d.volume,
    change: +d.diff,
    percentChange: +d.diff_percent,
  })).sort((a, b) => d3.ascending(accessor.d(a), accessor.d(b)));


  const newData = stockPrice.map((d) => ({
    date: parseDate(d.time),
    volume: +d.volume,
  })).reverse();

  svg.append('g')
    .attr('class', 'candlestick');
  svg.append('g')
    .attr('class', 'volume axis');
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0,${height})`);

  svg.append('g')
    .attr('class', 'y axis')
    .append('text')
    .attr('y', -10)
    .style('text-anchor', 'end')
    .text('Price (TWD)');
  // Data to display initially
  draw(data.slice(0, data.length), newData);


  function draw(data, volumeData) {
    // 設定domain，決定各座標所用到的資料
    x.domain(data.map(candlestick.accessor().d));
    y.domain(techan.scale.plot.ohlc(data, candlestick.accessor()).domain());
    xScale.domain(volumeData.map((d) => d.date));
    yVolume.domain(techan.scale.plot.volume(data).domain());

    // Add a clipPath: everything out of this area won't be drawn.
    const clip = svg.append('defs').append('svg:clipPath')
      .attr('id', 'clip')
      .append('svg:rect')
      .attr('width', width)
      .attr('height', height)
      .attr('x', 0)
      .attr('y', 0);
    // 針對K線圖的，讓他不會蓋到成交量bar chart
    const candlestickClip = svg.append('defs').append('svg:clipPath')
      .attr('id', 'candlestickClip')
      .append('svg:rect')
      .attr('width', width)
      .attr('height', height - 60)
      .attr('x', 0)
      .attr('y', 0);

    xScale.range([0, width].map((d) => d)); // 設定xScale回到初始值
    const chart = svg.selectAll('volumeBar') // 畫成交量bar chart
      .append('g')
      .data(volumeData)
      .enter()
      .append('g')
      .attr('clip-path', 'url(#clip)');

    chart.append('rect')
      .attr('class', 'volumeBar')
      .attr('x', (d) => xScale(d.date))
      .attr('height', (d) => height - yVolume(d.volume))
      .attr('y', (d) => yVolume(d.volume))
      .attr('width', xScale.bandwidth())
      .style('fill', (d, i) => { // 根據漲跌幅去決定成交量的顏色
        if (data[i].change > 0) { return '#FF0000'; } if (data[i].change < 0) {
          return '#00AA00';
        }
        return '#DDDDDD';
      });

    // 畫X軸
    svg.selectAll('g.x.axis').call(xAxis.ticks(7).tickFormat(d3.timeFormat('%y/%m')).tickSize(-height, -height));

    // 畫K線圖Y軸
    svg.selectAll('g.y.axis').call(yAxis.ticks(10).tickSize(-width, -width));

    // 畫Ｋ線圖
    const state = svg.selectAll('g.candlestick')
      .attr('clip-path', 'url(#candlestickClip)')
      .datum(data);
    state.call(candlestick)
      .each((d) => {
        dataArr = d;
      });

    svg.select('g.volume.axis').call(volumeAxis);

    // 畫十字線並對他設定zoom function
    svg.append('g')
      .attr('class', 'crosshair')
      .attr('width', width)
      .attr('height', height)
      .attr('pointer-events', 'all')
      .call(crosshair)
      .call(zoom);

    // 設定zoom的初始值
    zoomableInit = x.zoomable().clamp(false).copy();
    yInit = y.copy();
  }

  // 設定當移動的時候要顯示的文字
  function move(coords, index) {
    //    console.log("move");
    let i;
    for (i = 0; i < dataArr.length; i++) {
      if (coords.x === dataArr[i].date) {
        svgText.text(`${d3.timeFormat('%Y/%m/%d')(coords.x)}, 
        開盤：${dataArr[i].open}, 高：${dataArr[i].high}, 低：${dataArr[i].low}, 
        收盤：${dataArr[i].close}, 漲跌：${dataArr[i].change}(${dataArr[i].percentChange}%)` + `, 
        成交量：${dataArr[i].volume}`);
      }
    }
  }

  let rescaledX; let
    rescaledY;
  let t;
  function zoomed() {
    // 根據zoom去取得座標轉換的資料
    t = d3.event.transform;
    rescaledX = d3.event.transform.rescaleY(x);
    rescaledY = d3.event.transform.rescaleY(y);
    // y座標zoom
    yAxis.scale(rescaledY);
    candlestick.yScale(rescaledY);
    sma0.yScale(rescaledY);
    sma1.yScale(rescaledY);
    ema2.yScale(rescaledY);

    // Emulates D3 behaviour, required for financetime due to secondary zoomable scale
    // K線圖 x zoom
    x.zoomable().domain(d3.event.transform.rescaleX(zoomableInit).domain());
    // 成交量 x  zoom
    xScale.range([0, width].map((d) => d3.event.transform.applyX(d)));

    // 更新座標資料後，再重新畫圖
    redraw();
  }


  function redraw() {
    svg.select('g.candlestick').call(candlestick);
    svg.select('g.x.axis').call(xAxis);
    svg.select('g.y.axis').call(yAxis);
    svg.selectAll('rect.volumeBar')
      .attr('x', (d) => xScale(d.date))
      .attr('width', (xScale.bandwidth()));
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
