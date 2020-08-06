require('dotenv').config();
const validator = require('validator');
const fetch = require('node-fetch'); // npm install node-fetch --save
const User = require('../models/user_model');

const signUp = async (req, res) => {
  const { provider } = req.body;
  let { name } = req.body;
  const { email } = req.body;
  const { picture } = req.body;
  const { password } = req.body;
  if (!name || !email || !password) {
    res.status(400).send({ error: 'Request Error: name, email and password are required.' });
    return;
  }
  // if (!validator.isEmail(email)) {
  //   res.status(400).send({ error: 'Request Error: Invalid email format' });
  //   return;
  // }
  // name = validator.escape(name);
  const result = await User.signUp(provider, name,
    email, picture, password);
  if (result.error) {
    res.status(403).send({ error: result.error });
    return;
  }
  res.status(200).send(result);
};

const signIn = async (req, res) => {
  if (req.body.provider === 'facebook' && req.body.access_token) {
    let fbResponse;
    await fetch(`https://graph.facebook.com/me?fields=id,name,picture,email&access_token=${req.body.access_token}`, {
      method: 'get',
      // body:    JSON.stringify(body),
      // headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.json())
      .then((value) => fbResponse = value)
      .catch((error) => console.error('Error:', error));
    const { provider } = req.body;
    const { name } = fbResponse;
    const { email } = fbResponse;
    const picture = fbResponse.picture.data.url;
    const password = 'facebook';
    const result = await User.fbSignIn(provider, name,
      email, picture, password);
    if (result.error) {
      res.status(403).send({ error: result.error });
      return;
    }
    res.status(200).send(result);
  } else {
    const { email } = req.body;
    const { password } = req.body;
    if (!email || !password) {
      res.status(400).send({ error: 'Request Error: name, email and password are required.' });
      return;
    }
    const result = await User.nativeSignIn(email, password);

    if (result.error) {
      res.status(403).send({ error: result.error });
      return;
    }
    res.status(200).send(result);
  }
};

const getUserProfile = async (req, res) => {
  const bearerHeader = req.headers.authorization;
  // Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
  } else {
    res.status(403).send({ error: 'header undefined' });
  }
  const result = await User.getUserProfile(req.token);
  if (result.error) {
    res.status(403).send({ error: result.error });
    return;
  }
  res.status(200).json({data:result});
};
module.exports = {
  signUp,
  signIn,
  getUserProfile,
};
