require('dotenv').config('/');

const host = process.env.HOST;
const user = process.env.MYUSER;
const password = process.env.PASSWORD;
const database = process.env.DATABASE;
const mysql = require('mysql');

const db = mysql.createPool({
  connectionLimit: 100,
  host,
  user,
  password,
  database,
});

module.exports = { db };
