/* eslint-disable max-classes-per-file */
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

const { db } = mysql;
const dbquery = promisify(db.query).bind(db);


// const minStartValue = function (nums) {
  
// };
// async function main() {

// }

// main();
let func2 = (x) => {

  // 讓他跑 10000000 次
  if (x === 20000)
      return x;

  return func2(x + 1);
};

let ret = func2(0);
console.log(ret);