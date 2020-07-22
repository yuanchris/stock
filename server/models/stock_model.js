/* eslint-disable camelcase */
require('dotenv').config();

const mysql = require('../../util/mysql_con.js');

const { db } = mysql;

const { promisify } = require('util');

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

const news = async (stock, start, end) => {
  try {
    const result = await dbquery(`SELECT *
      FROM stock_news_brief WHERE stock = ${stock} 
      AND date BETWEEN "${start}"  AND "${end}"
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

const revenue = async (stock, date) => {
  try {
    const dateInput = date.replace('-', '/');
    const result = await dbquery(`SELECT *
      FROM stock_revenue WHERE stock = ${stock} AND month between 
      '2011/01' AND '${dateInput}' `);
    if (result.length === 0) {
      return { error: 'No news in database' };
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
    const result = await dbquery(`SELECT *
      FROM stock_per WHERE stock = ${stock} AND week BETWEEN
       '1101' AND '${dateInput}'`);
    if (result.length === 0) {
      return { error: 'No news in database' };
    }

    return result;
  } catch (error) {
    console.log(error);
    return { error };
  }
};

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
      finishdate,
    };
    const stock = await dbquery('INSERT INTO user_playlist SET ?', post);
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
    const result = await dbquery(`SELECT *
      FROM user_playlist ORDER by totalmoney DESC`);
    if (result.length === 0) {
      return { error: 'No result in database' };
    }

    return result;
  } catch (error) {
    console.log(error);
    return { error };
  }
};

function getYearWeek(date) {
  const now_date = new Date(date);
  const date2 = new Date(now_date.getFullYear(), 0, 1);
  const d = Math.round((now_date.getTime() - date2.getTime()) / 86400000);
  // console.log(`${now_date.getFullYear() % 2000}${Math.ceil(d / 7)}`);
  return `${now_date.getFullYear() % 2000}${Math.ceil(d / 7)}`;
}


module.exports = {
  info,
  price,
  news,
  revenue,
  per,
  result,
  rank,
};
