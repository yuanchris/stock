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

}

