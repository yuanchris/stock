/* eslint-disable camelcase */
/* eslint-disable no-await-in-loop */
const list = document.querySelector('#stock-list');
let playDate = localStorage.getItem('playDate');
let playStock = JSON.parse(localStorage.getItem('playStock'));
let portfolio = JSON.parse(localStorage.getItem('portfolio'));
const final_result = JSON.parse(localStorage.getItem('final_result'));
const finishDate = parseInt(localStorage.getItem('finishDate'));

main();
async function main() {
  if (playDate && playStock && portfolio && finishDate && name) {
    const validate = await fetch(`api/1.0/stock/validate?playdate=${playDate}
      &playstock=${JSON.stringify(playStock)}
      &name=${name}&finishdate=${finishDate}`, {
      method: 'GET',
    }).then((res) => res.json());
    if (validate.length == 0) {
      await Swal.fire('Your play data is wrong! Restart your game');
      localStorage.removeItem('playDate');
      localStorage.removeItem('playStock');
      localStorage.removeItem('portfolio');
      localStorage.removeItem('finishDate');
      window.location.href = './';
      return;
    }
    show(playDate, playStock, portfolio, true);
    const final_result_obj = {
      name, playStock, playDate, portfolio,
    };
    localStorage.setItem('final_result', JSON.stringify(final_result_obj));
    localStorage.removeItem('playDate');
    localStorage.removeItem('playStock');
    localStorage.removeItem('portfolio');
    localStorage.removeItem('finishDate');
  } else if (final_result) {
    localStorage.removeItem('playDate');
    localStorage.removeItem('playStock');
    localStorage.removeItem('portfolio');
    localStorage.removeItem('finishDate');
    playDate = final_result.playDate;
    playStock = final_result.playStock;
    portfolio = final_result.portfolio;
    show(playDate, playStock, portfolio, false);
  } else {
    const now = Date.now();
    const time_remain_value = finishDate + 15 * 60 * 1000 - now;
    let min = Math.floor(time_remain_value / 1000 / 60);
    if (parseInt(min) < 0) {
      Swal.fire('時間到，但你沒有投資', '將刪除遊戲資料');
      localStorage.removeItem('playDate');
      localStorage.removeItem('playStock');
      localStorage.removeItem('finishDate');
      window.location.href = './index.html';
    } else {
      Swal.fire('你沒有選擇任何股票', '將跳轉回投資選擇')
      .then((value) => { window.location.href = './choice.html'; });
    }
  }
}


async function show(playDate, playStock, portfolio, insertboolean) {
  const before_date = new Date(playDate);
  const mill = before_date.getTime();
  const new_date = getDate(mill + 90 * 1000 * 60 * 60 * 24);
  const post = { playDate: new_date, playStock };


  const stockPrice = await fetch('api/1.0/stock/price', {
    method: 'POST',
    body: JSON.stringify(post),
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => (res.json()));
  const stockPriceGroup = _.groupBy(stockPrice, 'stock');
  // console.log(stockPriceGroup);
  const wait = document.querySelector('#wait');
  wait.innerHTML = '';
  const nowDate = document.querySelector('#nowDate');
  nowDate.innerHTML = `<h3>當時：${playDate} -> 現在： ${new_date}</h3>`;
  const earnArr = [];

  for (let i = 0; i < playStock.length; i++) {
    const row = document.createElement('div');
    row.setAttribute('class', 'row');
    row.innerHTML = `<h3>${playStock[i].id} ${playStock[i].stock}
    (${playStock[i].industry})</h3>`;
    const price_curve = document.createElement('div');

    const details = document.createElement('div');
    details.setAttribute('class', 'details');

    // curve
    price_curve.setAttribute('class', `curve${i}`);
    details.appendChild(price_curve);

    // item
    const item = document.createElement('div');
    item.setAttribute('class', 'item');

    const before_price = document.createElement('div');
    before_price.setAttribute('class', 'before_price');

    let before_price_value = stockPriceGroup[playStock[i].id]
      .find((x) => x.time == playDate);
    let count = 0;
    let try_date = new Date(playDate);
    while (!before_price_value) {
      if (count > 30) { break; }
      try_date = new Date(try_date);
      try_date = try_date.getTime();
      try_date = getDate(try_date - 1 * 1000 * 60 * 60 * 24);
      before_price_value = stockPriceGroup[playStock[i].id]
        .find((x) => x.time == try_date);
      count += 1;
    }
    before_price_value = before_price_value.price;
    before_price.innerHTML = `當時股價： 
      ${before_price_value}`;

    const now_price = document.createElement('div');
    now_price.setAttribute('class', 'now_price');
    let now_price_value = 0;
    for (let j = 0; j < 7; j++) {
      now_price_value += stockPriceGroup[playStock[i].id][j].price;
    }
    now_price_value /= 7;
    now_price_value = now_price_value.toFixed(2) * 100 / 100;
    now_price.innerHTML = `現在股價： 
      ${now_price_value}`;
    item.appendChild(before_price);
    item.appendChild(now_price);


    const qty = document.createElement('div');
    qty.setAttribute('class', 'qty');
    const qty_label = document.createElement('label');
    qty_label.setAttribute('for', `qty${i}`);

    const storage = portfolio.list.find((x) => {
      if (x.stock_id == playStock[i].id) {
        return x;
      }
    });
    if (storage) {
      if (storage.buyShort_value == 'buy') {
        qty_label.innerHTML = `<nobr style= "color:purple;">
          買進 </nobr> ${storage.qty} 張<br>
          成本 ${(storage.total_price / 10).toFixed(3) * 1000 / 1000} 萬`;
      } else {
        qty_label.innerHTML = `<nobr style= "color:purple;">
          放空 </nobr> ${storage.qty} 張<br>
          成本 ${(storage.total_price / 10).toFixed(3) * 1000 / 1000} 萬`;
      }
    } else {
      qty_label.innerHTML = '0 張<br>成本 0 萬';
    }
    qty.appendChild(qty_label);
    item.appendChild(qty);

    const ratio = document.createElement('div');
    ratio.setAttribute('class', 'ratio');

    if (storage) {
      if (storage.buyShort_value == 'buy') {
        ratio.innerHTML = `報酬率： 
        ${((now_price_value
          - before_price_value) / before_price_value * 100).toFixed(2)
          * 100 / 100} %`;
      } else {
        ratio.innerHTML = `報酬率： 
        ${((now_price_value
          - before_price_value) / before_price_value * 100).toFixed(2)
          * 100 / 100 * (-1)} %`;
      }
      storage.now_price_value = now_price_value;
    } else {
      ratio.innerHTML = `報酬率： 
      ${((now_price_value
        - before_price_value) / before_price_value * 100).toFixed(2)
        * 100 / 100} %`;
    }
    item.appendChild(ratio);

    const price = document.createElement('div');
    price.setAttribute('class', 'price');
    if (storage) {
      const earn = (storage.total_price / 10
        * ((now_price_value
        - before_price_value)
        / before_price_value)).toFixed(2) * 100 / 100;
      if (storage.buyShort_value == 'buy') {
        earnArr[i] = earn;
        price.innerHTML = `獲利(TWD)： ${earn} 萬`;
      } else {
        earnArr[i] = -1 * earn;
        price.innerHTML = `獲利(TWD)： ${(-1) * earn} 萬`;
      }
    } else {
      price.innerHTML = '獲利(TWD)： 0 萬';
    }
    item.appendChild(price);
    details.appendChild(item);
    row.appendChild(details);
    list.appendChild(row);
    plot2(stockPriceGroup[playStock[i].id], `curve${i}`);
  }
  const total_money = document.querySelector('#total');
  let total_money_value = 2000;
  for (let i = 0; i < earnArr.length; i++) {
    // console.log(earnArr[i]);
    if (earnArr[i]) {
      total_money_value += earnArr[i];
    }
  }
  total_money_value = total_money_value.toFixed(3) * 1000 / 1000;
  total_money.innerHTML = `資產總計(TWD)：${total_money_value} 萬`;

  const invest_ratio = document.querySelector('#investRatio');
  let invest_ratio_value = 0;
  for (let i = 0; i < earnArr.length; i++) {
    if (earnArr[i]) {
      invest_ratio_value += earnArr[i];
    }
  }
  const total_ratio = document.querySelector('#totalRatio');
  const total_ratio_value = ((total_money_value - 2000) / 2000 * 100).toFixed(2) * 100 / 100;
  total_ratio.innerHTML = `總報酬率： ${total_ratio_value} %`;

  const invest_Total = document.querySelector('#investTotal');
  invest_Total.vaue = portfolio.total;
  invest_Total.innerHTML = `投資總金額： ${(portfolio.total / 10).toFixed(3) * 1000 / 1000} 萬`;

  invest_ratio_value = invest_ratio_value / (portfolio.total / 10) * 100;
  invest_ratio_value = invest_ratio_value.toFixed(2) * 100 / 100;
  invest_ratio.innerHTML = `投資報酬率： ${invest_ratio_value} %`;

  if (insertboolean) {
    insertResult(name, total_money_value, invest_ratio_value, total_ratio_value,
      JSON.stringify(portfolio), JSON.stringify(playStock), playDate);
  }
  highlightNum();
}

async function insertResult(name, total_money_value,
  invest_ratio_value, total_ratio_value, portfolio, playStock, playDate) {
  const post = {
    name,
    total_money_value,
    invest_ratio_value,
    total_ratio_value,
    portfolio,
    playStock,
    playDate,
    finishDate,
  };
  const result = await fetch('api/1.0/stock/result', {
    method: 'POST',
    body: JSON.stringify(post),
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => (res.json()));
}

// 依據數字正負上色
function highlightNum() {
  // 1.获取要高亮显示的行
  let rowNode = $('.ratio,.price, #totalRatio, #investRatio');
  console.log(rowNode);
  // 2.获取搜索的内容
  // 3.遍历整行内容，添加高亮颜色
  rowNode.each(function () {
    let newHtml = $(this).html();
    let number = newHtml.split(' ')[newHtml.split(' ').length - 2];
    console.log(number);
    if (number < 0) {
      newHtml = newHtml.replace(number, `<span style="color:green">${number}</span>`);
      $(this).html(newHtml);
    } else if (number > 0) {
      newHtml = newHtml.replace(number, `<span style="color:red">${number}</span>`);
      $(this).html(newHtml);
    }
  });

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

  let zoomableInit; let
    yInit;
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
    .translate([0, height]);

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
