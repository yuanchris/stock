/* eslint-disable no-use-before-define */

require('dotenv').config();

const secretKey = process.env.SECRET;
const expire = process.env.TOKEN_EXPIRE; // 30 days by seconds
const cheerio = require('cheerio');
const rp = require('request-promise');
const { promisify } = require('util');

const mysql = require('../../util/mysql_con.js');
const { db } = mysql;
const dbquery = promisify(db.query).bind(db);

const crypto = require('crypto');
const jwt = require('jsonwebtoken'); // npm i jsonwebtoken


const signUp = async (provider, name,
  email, picture, password) => {
  try {
    const sha = crypto.createHash('sha256').update(password).digest('hex');
    const post = {
      provider, name, email, picture, password: sha,
    };
    const NameResult = await dbquery('SELECT * FROM user WHERE name = ?',
      name);
    if (NameResult.length > 0) {
      return { error: 'Name Already Exists' };
    }
    const EmailResult = await dbquery('SELECT * FROM user WHERE email = ?',
      email);
    if (EmailResult.length > 0) {
      return { error: 'Email Already Exists' };
    }
    const InsertResult = await dbquery('INSERT INTO user SET ?', post);
    const id = InsertResult.insertId;
    const access_token = jwt.sign({
      id, provider, name, email, picture,
    }, secretKey, { expiresIn: expire });
    const data = {
      data: {
        access_token,
        access_expired: expire,
        user: {
          id, provider, name, email, picture,
        },
      },
    };
    return data;
  } catch (error) {
    console.log(error);
    return { error };
  }
};

const fbSignIn = async (provider, name,
  email, picture, password) => {
  try {
    const checkEmail = await dbquery('SELECT * FROM user WHERE email = ? AND provider = ?',
      [email, provider]);
    if (checkEmail.length > 0) {
      const { id } = checkEmail[0];
      const access_token = jwt.sign({
        id, provider, name, email, picture,
      }, secretKey, { expiresIn: expire });
      const data = {
        data: {
          access_token,
          access_expired: expire,
          user: {
            id, provider, name, email, picture,
          },
        },
      };
      return data;
    }

    const post = {
      provider, name, email, picture, password,
    };
    const InsertResult = await dbquery('INSERT INTO user SET ?', post);
    const id = InsertResult.insertId;
    const access_token = jwt.sign({
      id, provider, name, email, picture,
    }, secretKey, { expiresIn: expire });
    const data = {
      data: {
        access_token,
        access_expired: expire,
        user: {
          id, provider, name, email, picture,
        },
      },
    };
    return data;
  } catch (error) {
    console.log(error);
    return { error };
  }
};

const nativeSignIn = async (email, password) => {
  try {
    const sha = crypto.createHash('sha256').update(password).digest('hex');
    const checkEmail = await dbquery('SELECT * FROM user WHERE email = ? AND password = ?',
      [email, sha]);
    if (checkEmail.length > 0) {
      const { id } = checkEmail[0];
      const { provider } = checkEmail[0];
      const { name } = checkEmail[0];
      const { picture } = checkEmail[0];
      const access_token = jwt.sign({
        id, provider, name, email, picture,
      }, secretKey, { expiresIn: expire });
      const data = {
        data: {
          access_token,
          access_expired: expire,
          user: {
            id, provider, name, email, picture,
          },
        },
      };
      return data;
    }
    return { error: 'Email or Password is wrong' };
  } catch (error) {
    console.log(error);
    return { error };
  }
};

const getUserProfile = async (token) => {
  try {
    const verify = jwt.verify(token, secretKey, (err, data) => {
      if (err) {
        return { error: 'Incorrect token or token expired' };
      }
      return data;
    });
    return verify;
  } catch (error) {
    console.log(error);
    return { error };
  }
};

module.exports = {
  signUp,
  fbSignIn,
  nativeSignIn,
  getUserProfile,
};
