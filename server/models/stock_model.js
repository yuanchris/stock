/* eslint-disable no-use-before-define */

require('dotenv').config();
const cheerio = require('cheerio');
const rp = require('request-promise');
const { promisify } = require('util');
const mysql = require('../../util/mysql_con.js');

const { db } = mysql;


const dbquery = promisify(db.query).bind(db);

const info = async () => {
  try {
    const stock = await dbquery('SELECT * FROM stock_info_select');
    if (stock.length == 0) {
      return { error: 'no stock in database' };
    }
    return stock;
  } catch (error) {
    return { error };
  }
};

const start = async (name) => {
  try {
    const stockTotal = 137;
    const stock = await dbquery('SELECT * FROM stock_info_select');
    if (stock.length == 0) {
      return { error: 'no stock in database' };
    }
    let randomStock = new Set([randomStockNum(stockTotal), randomStockNum(stockTotal),
      randomStockNum(stockTotal), randomStockNum(stockTotal),
      randomStockNum(stockTotal)]);
    randomStock = [...randomStock];
    while (randomStock.length !== 5) {
      randomStock = new Set(randomStockNum(stockTotal), randomStockNum(stockTotal),
        randomStockNum(stockTotal), randomStockNum(stockTotal),
        randomStockNum(stockTotal));
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
    const recordDate = Date.now();
    const post = {
      playdate: randomPlayDate,
      playstock: JSON.stringify(randomPlayStock),
      finishdate: recordDate,
      name,
    };
    const input = await dbquery('INSERT INTO user_playlist SET ?', post);
    return post;
  } catch (error) {
    console.log(error);
    return { error };
  }
};

const pk = async (IdArray) => {
  try {
    const stockTotal = 137;
    const stock = await dbquery('SELECT * FROM stock_info_select');
    if (stock.length == 0) {
      return { error: 'no stock in database' };
    }
    let randomStock = new Set([randomStockNum(stockTotal), randomStockNum(stockTotal),
      randomStockNum(stockTotal), randomStockNum(stockTotal),
      randomStockNum(stockTotal)]);
    randomStock = [...randomStock];
    while (randomStock.length !== 5) {
      randomStock = new Set([randomStockNum(stockTotal), randomStockNum(stockTotal),
        randomStockNum(stockTotal), randomStockNum(stockTotal),
        randomStockNum(stockTotal)]);
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
    const recordDate = Date.now();
    const post = [
      [IdArray[0], randomPlayDate, JSON.stringify(randomPlayStock), recordDate, IdArray[1]],
      [IdArray[1], randomPlayDate, JSON.stringify(randomPlayStock), recordDate, IdArray[0]],
    ];
    const input = await dbquery('INSERT INTO user_playlist (name, playdate, playstock, finishdate, opponent) VALUES ?', [post]);
    return {
      playdate: randomPlayDate,
      playstock: JSON.stringify(randomPlayStock),
      finishdate: recordDate,
    };
  } catch (error) {
    console.log(error);
    return { error };
  }
};
function randomStockNum(stockTotal) {
  return Math.floor(Math.random() * stockTotal);
}

function randomDate() {
  let timestamp = 0;
  do {
    const startDate = new Date(2014, 0, 1).getTime();
    const endDate = new Date(2019, 9, 1).getTime();
    const spaces = (endDate - startDate);
    timestamp = Math.floor(Math.random() * spaces);
    timestamp += startDate;
    timestamp = new Date(timestamp);
  }
  while ((timestamp.getMonth() + 1) >= 3 && (timestamp.getMonth() + 1) <= 9);
  return new Date(timestamp);
}
function formatDate(date) {
  let month = date.getMonth() + 1;
  let day = date.getDate();
  month = month < 10 ? `0${month}` : month;
  day = day < 10 ? `0${day}` : day;
  return `${String(date.getFullYear())}-${month}-${day}`;
}


const price = async (playDate, playStock) => {
  try {
    // console.log(playDate);
    // console.log(playStock);
    const inputArr = [];
    for (let i = 0; i < playStock.length; i++) {
      inputArr[i] = playStock[i].id;
    }
    // console.log(inputArr);
    const stock = await dbquery(`SELECT *
      FROM stock_price WHERE stock in (${inputArr}) AND time <= '${playDate}'`);
    if (stock.length === 0) {
      return { error: 'no stock in database' };
    }
    // console.log(stock.length);
    return stock;
  } catch (error) {
    console.log(error);
    return { error };
  }
};

const news = async (stock, startDate, end) => {
  try {
    const result = await dbquery(`SELECT *
      FROM stock_news_brief WHERE stock = ${stock} 
      AND date BETWEEN "${startDate}"  AND "${end}"
      ORDER BY date DESC`);
    // console.log(result);
    if (result.length === 0) {
      return { error: 'No news in database' };
    }

    return result;
  } catch (error) {
    console.log(error);
    return { error };
  }
};

const crawlText = async (href) => {
  try {
    const result = [];
    await rp(href)
      .then((htmlString) => {
        const $2 = cheerio.load(htmlString);
        const newsItem = $2('.text > p').not('.before_ir, .appE1121');
        // console.log(news_item);
        const text = [];
        for (let i = 0; i < newsItem.length; i++) {
          if (newsItem.eq(i).text() !== '') {
            text.push(newsItem.eq(i).text());
            // .filter(function () { return this.nodeType == 3; })
          }
        }
        // console.log(text);
        result.push(JSON.stringify(text));
      });
    if (result.length === 0) {
      return { error: 'No text' };
    }
    return result;
  } catch (error) {
    console.log(error);
    return { error };
  }
};


const revenue = async (stock, date) => {
  try {
    const dateInput = date.replace('-', '/');
    const result = await dbquery(`SELECT *
      FROM stock_revenue WHERE stock = ${stock} AND month >=
      '2011/01' AND month < '${dateInput}' `);
    if (result.length === 0) {
      return { error: 'No data in database' };
    }

    return result;
  } catch (error) {
    console.log(error);
    return { error };
  }
};

const per = async (stock, date) => {
  try {
    const dateInput = getYearWeek(date);
    // console.log(dateInput);
    const result = await dbquery(`SELECT *
      FROM stock_per WHERE stock = ${stock} AND week >=
       '1101' AND week < '${dateInput}'`);
    if (result.length === 0) {
      return { error: 'No data in database' };
    }

    return result;
  } catch (error) {
    console.log(error);
    return { error };
  }
};

const eps = async (stock, date) => {
  try {
    const dateInput = getSeason(date);
    const result = await dbquery(`SELECT *
      FROM stock_eps WHERE stock = ${stock} AND season >=
       '2011Q1' AND  season <= '${dateInput}'`);
    if (result.length === 0) {
      return { error: 'No data in database' };
    }

    return result;
  } catch (error) {
    console.log(error);
    return { error };
  }
};

function getSeason(date) {
  const nowDate = new Date(date);
  const season = Math.ceil((nowDate.getMonth() + 1) / 3);
  let post;
  if ((season - 2) < 1) {
    post = `${nowDate.getFullYear() - 1}Q${season - 2 + 4}`;
  } else {
    post = `${nowDate.getFullYear()}Q${season - 2}`;
  }
  return post;
}


const result = async (name, totalmoney, invest_ratio,
  total_ratio, portfolio, playstock, playdate, finishdate) => {
  try {
    const post = {
      name,
      totalmoney,
      invest_ratio,
      total_ratio,
      portfolio,
      playstock,
      playdate,
    };
    // const stock = await dbquery('INSERT INTO user_playlist SET ?', post);
    const stock = await dbquery(`UPDATE user_playlist SET ? WHERE 
    playdate = '${playdate}' AND name = '${name}' 
    AND finishdate = ${finishdate} AND playstock = '${playstock}'`, post);

    if (stock.length === 0) {
      return { error: 'Insert error' };
    }
    // console.log(stock.length);
    return stock;
  } catch (error) {
    console.log(error);
    return { error };
  }
};

const rank = async () => {
  try {
    const resultSql = await dbquery(`SELECT *
      FROM user_playlist ORDER by totalmoney DESC`);
    if (resultSql.length === 0) {
      return { error: 'No result in database' };
    }

    return resultSql;
  } catch (error) {
    console.log(error);
    return { error };
  }
};

const validate = async (playdate, name, finishdate, playstock) => {
  try {
    const resultSql = await dbquery(`SELECT *
      FROM user_playlist WHERE playdate = '${playdate}' AND name = '${name}' 
      AND finishdate = ${finishdate} AND playstock = '${playstock}'`);

    return resultSql;
  } catch (error) {
    console.log(error);
    return { error };
  }
};

function getYearWeek(date) {
  const nowDate = new Date(date);
  const date2 = new Date(nowDate.getFullYear(), 0, 1);
  let d = Math.round((nowDate.getTime() - date2.getTime()) / 86400000);
  d = Math.ceil(d / 7) < 10 ? (`0${Math.ceil(d / 7)}`) : Math.ceil(d / 7);
  // console.log(`${now_date.getFullYear() % 2000}${Math.ceil(d / 7)}`);
  return `${nowDate.getFullYear() % 2000}${d}`;
}


module.exports = {
  info,
  start,
  pk,
  price,
  news,
  crawlText,
  revenue,
  per,
  eps,
  result,
  rank,
  validate,
};
