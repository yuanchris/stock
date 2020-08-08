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


const minStartValue = function (nums) {
  let start = 1;
  let result = start;
  let token = 0;
  while (true) {
    result = start;
    for (let i = 0; i < nums.length; i++) {
      result += nums[i];
      if (result < 1) {
        start += 1
        break;
      }
      if (i === nums.length - 1) {
        token = 1;
      }
    }
    if (token === 1) {
      break;
    }
    console.log(start);
  }
  return start;
};
async function main() {
  const nums = [-3, 2, -3, 4, 2];
  console.log('final: ', minStartValue(nums));
}

main();
