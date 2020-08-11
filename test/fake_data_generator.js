/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
/* eslint-disable no-undef */
require('dotenv').config();

const { NODE_ENV } = process.env;
const {
  user_playlist,
  users,
} = require('./fake_data');
const mysql = require('../util/mysql_con.js');

const { db } = mysql;
const { promisify } = require('util');

const dbquery = promisify(db.query).bind(db);
const crypto = require('crypto');

function generateFakeUser() {
  const encryped_users = users.map((user) => {
    const encryped_user = {
      provider: user.provider,
      email: user.email,
      password: user.password ? crypto.createHash('sha256').update(user.password).digest('hex') : null,
      name: user.name,
      picture: user.picture,
    };
    return encryped_user;
  });
  return dbquery('INSERT INTO user (provider, email, password, name, picture) VALUES ?', [encryped_users.map(x => Object.values(x))]);
}

function generateFakePlaylist() {
  return dbquery('INSERT INTO user_playlist (name, totalmoney, invest_ratio, total_ratio, portfolio, playstock, playdate, finishdate, opponent) VALUES ?', [user_playlist.map((x) => Object.values(x))]);
}


function createFakeData() {
  if (NODE_ENV !== 'test') {
    console.log('Not in test env');
    return;
  }

  return generateFakePlaylist()
    .then(generateFakeUser)
    .catch(console.log);
}

function truncateFakeData() {
  if (NODE_ENV !== 'test') {
    console.log('Not in test env');
    return;
  }

  console.log('truncate fake data');
  const setForeignKey = (status) => dbquery('SET FOREIGN_KEY_CHECKS = ?', status);

  const truncateTable = (table) => dbquery(`TRUNCATE TABLE ${table}`);

  return setForeignKey(0)
    .then(truncateTable('user_playlist'))
    .then(truncateTable('user'))
    .then(setForeignKey(1))
    .catch(console.log);
}

function closeConnection() {
  return db.end();
}

// execute when called directly.
if (require.main === module) {
  console.log('main');
  truncateFakeData()
    .then(createFakeData)
    .then(closeConnection);
}

module.exports = {
  createFakeData,
  truncateFakeData,
  closeConnection,
};
