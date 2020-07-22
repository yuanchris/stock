/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-arrow-callback */
const express = require('express');
require('dotenv').config('../');
const request = require('request');
const rp = require('request-promise');

const iconv = require('iconv-lite');
const cheerio = require('cheerio');
const { promisify } = require('util');

const mysql = require('./util/mysql_con.js');
const utility = require('./util/util.js');
const db = mysql.db;
const dbquery = promisify(db.query).bind(db);

main();
async function main() {
  try {
    const allStock = await dbquery(`SELECT id, stock FROM stock_info`);
    for (let i = 1; i < allStock.length; i++) {
      console.log(allStock[i].id);
      // let stockNewsArr = [];
      let start = 20180101; //20150101
      let end = 20180201;
      while (start < 20200630) {
        console.log(start);
        await sleep(2000);
        // console.log('wait 1s');
        let monthNews = await crawl(`${allStock[i].stock}`, `${allStock[i].id}`, start, end);
        if (monthNews.length !== 0) {
          let sql = await dbquery(`INSERT INTO stock_news (stock, date, title, brief, text) VALUES ?`, [monthNews]);
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
    let monthNews = [];
    const search = encodeURIComponent(stockName);
    let url = `https://news.ltn.com.tw/search?keyword=${search}&conditions=or&start_time=${start}&end_time=${end}`;
    let list = await rp(url)
      .then(function (htmlString) {
        const $ = cheerio.load(htmlString);
        // 篩選有興趣的資料
        const list = $('.whitecon ul li');
        return list;
      })
      .catch(function (err) {
        console.log(`擷取錯誤：${err}`);
        reject(err);
      });
    for (let n = 0; n < list.length; n++) {  // 1 month
      const date = list.eq(n).find('span').text().split(" ")[0];
      const title = list.eq(n).find('.tit').text();
      const brief = list.eq(n).find('p').text();
      let newsArr = [stockNum, date, title, brief];
      await sleep(2000);
      // console.log('wait 1s');
      const href = list.eq(n).find('.tit').attr('href');
      await rp(href)
        .then(function (htmlString) {
          const $2 = cheerio.load(htmlString);
          const news = $2('.text p').not('.before_ir, .appE1121');
          const text = [];
          for (let i = 0; i < news.length - 1; i++) {
            if (news.eq(i).text() !== '') {
              text.push(news.eq(i).text());
            }
          }
          newsArr.push(JSON.stringify(text));
          monthNews.push(newsArr);
        });
    }
    // console.log(monthNews);
    resolve(monthNews);
  });
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

