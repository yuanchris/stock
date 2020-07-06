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
  const allStock = await dbquery(`SELECT id, stock FROM stock_info`);
  for (let i = 0; i < 1; i++) {
    let start = 20110101;
    let end = 20110201;
    while (start < 20110330) {
      await sleep(3000);
      console.log('wait 3s');
      await crawl(`${allStock[i].stock}`,`${allStock[i].id}`, start, end);
      start = end;
      if (end % 10000 !== 1201) {
        end += 100;
      } else {
        end += 8900;
      }
    }
  }
  console.log('all finished');

}

async function crawl(stockName, stockNum, start, end) {
  return new Promise(async (resolve, reject) => {
    console.log(start);
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
      let newsArr = { stock: stockNum, date: date, title: title, brirf: brief };
      await sleep(2000);
      console.log('wait 2s');
      const href = list.eq(n).find('.tit').attr('href');
      await rp(href)
        .then(function (htmlString) {
          const $2 = cheerio.load(htmlString);
          const news = $2('.text p').not('.before_ir, .appE1121');
          const text = [];
          for (let i = 0; i < news.length - 1; i++)
          {
            if (news.eq(i).text() !== '') {
              text.push(news.eq(i).text());
            }
          }
          newsArr.text = text;
          monthNews.push(newsArr);
   
        });
    }
    console.log(monthNews);
    resolve(monthNews);
    // request(url, async (error, response, body) => {
    //   if (!error) {
    //     const $ = cheerio.load(body);
    //     // 篩選有興趣的資料
    //     const list = $('.whitecon ul li');
    //     for (let n = 0; n < list.length; n++) {  // 1 month
    //       const date = list.eq(n).find('span').text().split(" ")[0];
    //       const title = list.eq(n).find('.tit').text();
    //       const brief = list.eq(n).find('p').text();
    //       let newsArr = { stock: stockNum, date: date, title: title, brirf: brief };
    //       await sleep(2000);
    //       console.log('wait 2s');
    //       const href = list.eq(n).find('.tit').attr('href');
    //       request(href, async (error, res, bo) => {  // every news
    //         const $2 = cheerio.load(bo);
    //         const news = $2('.text p').not('.before_ir, .appE1121');
    //         const text = [];
    //         for (let i = 0; i < news.length - 1; i++)
    //         {
    //           if (news.eq(i).text() !== '') {
    //             text.push(news.eq(i).text());
    //           }
    //         }
    //         newsArr.text = text;
    //         monthNews.push(newsArr);
    //         console.log(monthNews);
    //         // console.log(newsArr);
    //       });
    //     }
        
    //     // let sql = await dbquery(`INSERT INTO stock_info (id, stock, industry) VALUES ?`, [stockArr]);
    //     // console.log(sql);
    //     resolve(monthNews);
    //   } else {
    //     console.log(`擷取錯誤：${error}`);
    //     reject(error);
    //   }
    // });
  });
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

