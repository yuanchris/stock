/* eslint-disable camelcase */
/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-arrow-callback */

// use pupperteer
const express = require('express');
const request = require('request');
const rp = require('request-promise');
const puppeteer = require('puppeteer');

const iconv = require('iconv-lite');
const cheerio = require('cheerio');
const { promisify } = require('util');

const mysql = require('../util/mysql_con.js');
const db = mysql.db;
const dbquery = promisify(db.query).bind(db);

main();
async function main() {
  try {
    const allStock = await dbquery(`SELECT id FROM stock_info_select`);
    for (let i = 0; i < allStock.length; i++) {
      console.log(allStock[i].id);
      await crawl(allStock[i].id);
    }
    console.log('all finished');
  } catch (error) {
    console.log(error);
  }
}

async function crawl(stockNum) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto(`https://goodinfo.tw/StockInfo/ShowSaleMonChart.asp?STOCK_ID=${stockNum}`, { waitUntil: 'networkidle2' });
  await page.select('#selSaleMonChartPeriod', '10Y');
  // Scroll one viewport at a time, pausing to let content load
  const bodyHandle = await page.$('body');
  const { height } = await bodyHandle.boundingBox();
  
  const viewportHeight = page.viewport().height;
  let viewportIncr = 0;
  while (viewportIncr + viewportHeight < height) {
    await page.evaluate((_viewportHeight) => {
      window.scrollBy(0, _viewportHeight);
    }, viewportHeight);
    viewportIncr += viewportHeight;
  }
  //
  await sleep(100);

  const html = await page.content();
  const $ = cheerio.load(html);
  const tr = $('#divDetail > table tbody tr');
  for (let i = 0; i < tr.length; i++) {
    const row = tr.eq(i).find('td');
    const month = row.eq(0).text();
    const price = row.eq(2).text();
    const high = row.eq(3).text();
    const low = row.eq(4).text();
    const diff = row.eq(5).text();
    const diff_percent = row.eq(6).text();
    const revenue = row.eq(12).text().replace(',', '');
    const revenue_mondiff = row.eq(13).text();
    const revenue_yeardiff = row.eq(14).text();
    const accumulative = row.eq(15).text().replace(',', '');
    const accumulative_diff = row.eq(16).text();
    const stockArr = [stockNum, month, price, high, low, diff, diff_percent,
      revenue, revenue_mondiff, revenue_yeardiff, accumulative, accumulative_diff];
    let sql = await dbquery(`INSERT INTO stock_revenue (stock, month, price, high, low,
      diff, diff_percent, revenue, revenue_mondiff, revenue_yeardiff, accumulative,
      accumulative_diff) VALUES ?`, [[stockArr]]);
  }
  await browser.close();
  return 0;

}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
