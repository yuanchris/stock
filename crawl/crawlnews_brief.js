/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-arrow-callback */
const express = require('express');
const request = require('request');
const rp = require('request-promise');

const iconv = require('iconv-lite');
const cheerio = require('cheerio');
const { promisify } = require('util');

const mysql = require('../util/mysql_con.js');
const db = mysql.db;
const dbquery = promisify(db.query).bind(db);

main();
async function main() {
  try {
    const allStock = await dbquery(`SELECT id, stock FROM stock_info_select`);
    console.log(allStock.length);
    for (let i = 136; i < allStock.length; i++) {
      console.log(allStock[i].id);
      // let stockNewsArr = [];
      let start = 20110101;
      let end = 20110201;
      while (start < 20200630) {
        console.log(start);
        await sleep(2000);
        // console.log('wait 1s');
        let monthNews = await crawl(`${allStock[i].stock}`, `${allStock[i].id}`, start, end);
        if (monthNews.length !== 0) {
          let sql = await dbquery(`INSERT INTO stock_news_brief (stock, date, title, brief, href) VALUES ?`, [monthNews]);
        }
        // stockNewsArr.push(monthNews);
        start = end;
        if (end % 10000 !== 1201) {
          end += 100;
        } else {
          end += 8900;
        }
      }
      // let flat = stockNewsArr.flat(1);
      // let sql = await dbquery(`INSERT INTO stock_news (stock, date, title, brief, text) VALUES ?`, [flat]);
    }
    console.log('all finished');
  } catch (error) {
    console.log(error);
  }
}

async function crawl(stockName, stockNum, start, end) {
  return new Promise(async (resolve, reject) => {
    // console.log(start);
    const monthNews = [];
    const search = encodeURIComponent(stockName);
    const url = `https://news.ltn.com.tw/search?keyword=${search}&conditions=or&start_time=${start}&end_time=${end}`;
    const list = await rp(url)
      .then(function (htmlString) {
        const $ = cheerio.load(htmlString);
        // 篩選有興趣的資料
        const lists = $('.whitecon ul li');
        return lists;
      })
      .catch(function (err) {
        console.log(`擷取錯誤：${err}`);
        reject(err);
      });
    for (let n = 0; n < list.length; n++) { // 1 month
      const date = list.eq(n).find('span').text().split(" ")[0];
      const title = list.eq(n).find('.tit').text();
      const brief = list.eq(n).find('p').text();
      const href = list.eq(n).find('.tit').attr('href');
      const newsArr = [stockNum, date, title, brief, href];
      monthNews.push(newsArr);
    }
    // console.log(monthNews);
    resolve(monthNews);
  });
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
