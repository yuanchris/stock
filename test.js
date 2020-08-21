/* eslint-disable max-classes-per-file */
/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-arrow-callback */
// const express = require('express');
// require('dotenv').config('../');
// const request = require('request');
// const rp = require('request-promise');

// const iconv = require('iconv-lite');
// const cheerio = require('cheerio');
// const { promisify } = require('util');

// const mysql = require('./util/mysql_con.js');
// const utility = require('./util/util.js');

// const { db } = mysql;
// const dbquery = promisify(db.query).bind(db);



global.auntie = '漂亮阿姨';
function callAuntie () {
  
  console.log('call:', this.auntie);

  // function 內的 function
  function callAgainAuntie () {
    auntie = 123;
    console.log('call again:', this.auntie);
  }
  callAgainAuntie();
}

callAuntie(); 
// call: 漂亮阿姨
// call again: 123

