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

main();
async function main() {
  const randomArr = [];
  for (let i = 0; i < 100; i++) {
    randomArr[i] = formatDate(randomDate());
  }

  randomArr.sort();
  console.log(randomArr);
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
