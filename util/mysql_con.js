require('dotenv').config();
const mysql = require('mysql');


const env = process.env.NODE_ENV || 'production';
const multipleStatements = (process.env.NODE_ENV === 'test');
// const host = process.env.HOST;
// const user = process.env.MYUSER;
// const password = process.env.PASSWORD;
// const database = process.env.DATABASE;
const {
  HOST, MYUSER, PASSWORD, DATABASE, DATABASE_TEST,
} = process.env;

const mysqlConfig = {
  production: { // for EC2 machine
    connectionLimit: 100,
    host: HOST,
    user: MYUSER,
    password: PASSWORD,
    database: DATABASE,
  },
  development: { // for localhost development
    connectionLimit: 100,
    host: HOST,
    user: MYUSER,
    password: PASSWORD,
    database: DATABASE,
  },
  test: { // for automation testing (command: npm run test)
    connectionLimit: 100,
    host: HOST,
    user: MYUSER,
    password: PASSWORD,
    database: DATABASE_TEST,
  },
};

const db = mysql.createPool(mysqlConfig[env], { multipleStatements });

module.exports = { db };
