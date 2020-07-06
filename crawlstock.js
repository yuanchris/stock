const express = require('express');
require('dotenv').config('../');
const request = require('request');
const iconv = require('iconv-lite');
const cheerio = require('cheerio');
const { promisify } = require('util');

const mysql = require('./util/mysql_con.js');
const util = require('./util/util.js');
const db = mysql.db;
const dbquery = promisify(db.query).bind(db);

main();
async function main() {
  const allStock = await dbquery(`SELECT id FROM stock_info`);
  for (let i = 0; i < allStock.length; i++) {
    crawl(allStock[i].id);

    await sleep(1000);
  }
  console.log('finished');

}

async function crawl(stockNum) {
  const stockArr = [];
  const url = `https://ws.api.cnyes.com/charting/api/v1/history?resolution=D&symbol=TWS:${stockNum}:STOCK&from=1593820800&to=1293926400&quote=1`;
  request(url, async (error, response, body) => {
    if (!error) {
      const data = JSON.parse(body);
      // 篩選有興趣的資料
      for (let n = 0; n < data.data.t.length; n++) {
        let date = data.data.t[n];
        date = util.getDate(date);
        const price = data.data.c[n];
        const volume = Math.round(data.data.v[n]);
        stockArr.push([stockNum, date, price, volume]);
      }
    } else {
      console.log(`擷取錯誤：${error}`);
    }
    // await dbquery('DELETE FROM stock');
    let sql = await dbquery(`INSERT INTO stock (stock, time, price, volume) VALUES ?`, [stockArr]);
    // console.log(sql);
  });
}


async function info() {
  const stockArr = [];
  const url = 'https://isin.twse.com.tw/isin/C_public.jsp?strMode=2';
  request({url, encoding: null}, async (error, response, body) => {
    if (!error) {
      const html = iconv.decode(body, 'big5'); //decode big5
      const $ = cheerio.load(html);
      // const $ = cheerio.load(body);
      // 篩選有興趣的資料
      let list = $('.h4 tbody tr');
      for (let i = 2; i < 946; i++) {
        let id = list.eq(i).find('td').eq(0).text().split("　")[0];
        let stock = list.eq(i).find('td').eq(0).text().split("　")[1];
        let industry = list.eq(i).find('td').eq(4).text();
        stockArr.push([id, stock, industry]);
      }
      let sql = await dbquery(`INSERT INTO stock_info (id, stock, industry) VALUES ?`, [stockArr]);
      console.log(sql);

    } else {
      console.log(`擷取錯誤：${error}`);
    }
  });
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}