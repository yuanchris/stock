/* eslint-disable camelcase */

const final_result = JSON.parse(localStorage.getItem('final_result'));
const playDate = final_result.playDate;
const playStock = final_result.playStock;
const portfolio = final_result.portfolio;

const before_date = new Date(playDate);
const mill = before_date.getTime();
const new_date = getDate(mill + 90 * 1000 * 60 * 60 * 24);
  

main();
async function main() {
  if (playDate && playStock) {
    const nowDate = document.querySelector('#nowDate');
    nowDate.innerHTML = `<h3>當時：${playDate}，現在： ${new_date}</h3>`;
    const stockUl = document.querySelector('.stockUl');
    for (let i = 0; i < playStock.length; i++) {
      const stock_li = document.createElement('li');
      const stock_a = document.createElement('a');
      // stock_a.setAttribute('href', '');
      stock_a.setAttribute('onclick',
        `get_news(${playStock[i].id}, "${playStock[i].stock}")`);
      stock_a.innerHTML = `${playStock[i].id} 
       ${playStock[i].stock}`;
      stock_li.appendChild(stock_a);
      stockUl.appendChild(stock_li);
    }
  }
}

async function get_news(id, stock, start, end) {
  if (!start) {
    const end_date = new Date(new_date);
    const mill_get = end_date.getTime();
    start = getDate(mill_get - 365 * 1000 * 60 * 60 * 24);
    end = new_date;
    const from = document.querySelector('#from');
    from.value = start;
    const to = document.querySelector('#to');
    to.value = end;
  }
  const news = await fetch(`api/1.0/stock/news?stock=${id}&start=${start}&end=${end}`, {
    method: 'GET',
  }).then((res) => res.json());
  // console.log(news);

  const newslist = document.querySelector('#newslist');
  if (newslist.childElementCount !== 0) {
    newslist.innerHTML = ''; // delete before news
  }
  // if no news
  if (news.error) {
    newslist.innerHTML = '此區間查無新聞';
    return;
  }
  //
  const newsul = document.createElement('ul');
  newsul.setAttribute('class', 'newsul');
  newsul.setAttribute('id', `${id}`);
  newsul.setAttribute('stock', `${stock}`);
  for (let i = 0; i < news.length; i++) {
    const row = document.createElement('li');
    row.setAttribute('class', 'newsli');
    row.setAttribute('id', `news${i}`);
    row.setAttribute('onclick', `readMore(this.id, '${news[i].href}', '${stock}')`);
    const title = document.createElement('div');
    title.setAttribute('class', 'title');
    title.innerHTML = news[i].title;
    const date = document.createElement('div');
    date.setAttribute('class', 'date');
    date.innerHTML = news[i].date;
    const brief = document.createElement('div');
    brief.setAttribute('class', 'brief');
    brief.innerHTML = news[i].brief;
    row.append(title, date, brief);
    newsul.appendChild(row);
  }
  newslist.appendChild(newsul);
  highlightKeyword(stock);
}

async function search() {
  const newsul = document.querySelector('.newsul');
  const from = document.querySelector('#from');
  const to = document.querySelector('#to');
  get_news(newsul.id, newsul.getAttribute('stock'),
    from.value, to.value);
}

async function readMore(id, href, stock) {
  const selector = document.getElementById(id);
  const brief = selector.querySelector('.brief');
  let text = selector.querySelector('.text');
  if (!text) {
    let result = await fetch(`api/1.0/stock/news?href=${href}`, {
      method: 'GET',
    }).then((res) => res.json());
    result = JSON.parse(result);
    // console.log(id);
    // console.log(text);
    text = document.createElement('div');
    text.setAttribute('class', 'text');

    brief.setAttribute('style', 'display:none');
    for (let i = 0; i < result.length; i++) {
      text.innerHTML += result[i];
      text.innerHTML += '<br><br>';
    }
    selector.appendChild(text);
    highlightKeyword(stock);
  } else if (brief.getAttribute('style') == 'display:none') {
    brief.setAttribute('style', '');
    text.setAttribute('style', 'display:none');
  } else if (text.getAttribute('style') == 'display:none') {
    brief.setAttribute('style', 'display:none');
    text.setAttribute('style', '');
  }


  // window.open(href);
}

// 搜索关键字高亮
function highlightKeyword(keyword) {
  // 1.获取要高亮显示的行
  const rowNode = $('.newsli');
  // 2.获取搜索的内容
  // 3.遍历整行内容，添加高亮颜色
  rowNode.each(function () {
    let newHtml = $(this).html();
    let re = new RegExp(keyword, 'g');
    newHtml = newHtml.replace(re, `<span style="color:#ff6700">${keyword}</span>`);
    $(this).html(newHtml);
  });

}


// datepicker
$(() => {
  $('#from').datepicker({
    changeMonth: true,
    changeYear: true,
    dateFormat: 'yy-mm-dd',
    minDate: '2011-01-01',
    maxDate: new_date,
  });
  $('#to').datepicker({
    changeMonth: true,
    changeYear: true,
    dateFormat: 'yy-mm-dd',
    minDate: '2011-01-01',
    maxDate: new_date,
  });
});

