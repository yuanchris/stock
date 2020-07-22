require('dotenv').config('../');
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const secretKey = process.env.SECRET;

const crypto = require('crypto');
const jwt = require('jsonwebtoken'); // npm i jsonwebtoken
const fetch = require('node-fetch'); // npm install node-fetch --save


const mysql = require('../../util/mysql_con.js');
const db = mysql.db;
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
// =======================

router.post('/user/signup', (req, res) => {
  try {
    let post = {};
    const { name } = req.body;
    const { provider } = req.body;
    const { email } = req.body;
    const password = crypto.createHash('sha256').update(req.body.password).digest('hex');
    const { picture } = req.body;

    post = {
      provider, name, email, picture, password,
    };
    db.getConnection((error, connection) => {
      if (name && email && password) {
        connection.query('SELECT * FROM user WHERE name = ?', name, (error, results, fields) => {
          if (error) throw error;
          if (results.length > 0) {
            const err = new Error();
            err.status = 403;
            err.error = 'Name exists, please use another name';
            res.send(err);
          } else {
            connection.query('SELECT * FROM user WHERE email = ?', email, (error, results, fields) => {
              if (error) throw error;
              if (results.length > 0) {
                const err = new Error();
                err.status = 403;
                err.error = 'Email exists, please use another email';
                res.send(err);
              } else {
                connection.query('INSERT INTO user SET ?', post, (error, results, fields) => {
                  if (error) throw error;
                  const id = results.insertId;
                  const access_token = jwt.sign({
                    id, provider, name, email, picture,
                  },
                  secretKey, { expiresIn: '3600s' });
                  const data = {
                    data: {
                      access_token,
                      access_expired: 3600,
                      user: {
                        id, provider, name, email, picture,
                      },
                    },
                  };
                  res.json(data);
                });
              }
            });
          }
        });
      } else { // maybe useless if "input form" add "require" element in index.html
        const err = new Error();
        err.status = 400;
        err.error = 'Please enter all items';
        res.send(err);
      }
      // When done with the connection, release it.
      connection.release();
      // Handle error after the release.
      if (error) throw error;
    });
  } catch (error) {
    error.status = 500;
    error.error = 'Something wrong in server...';
    res.send(error);
  }
});

router.post('/user/signin', async (req, res) => {
  try {
    db.getConnection(async (error, connection) => {
      if (req.body.provider === 'facebook' && req.body.access_token) {
        let fbResponse;
        await fetch(`https://graph.facebook.com/me?fields=id,name,picture,email&access_token=${req.body.access_token}`, {
          method: 'get',
          // body:    JSON.stringify(body),
          // headers: { 'Content-Type': 'application/json' },
        }).then((res) => res.json())
          .then((value) => fbResponse = value)
          .catch((error) => console.error('Error:', error));
        // console.log("fbResponse" + fbResponse);
        const { provider } = req.body;
        const { name } = fbResponse;
        const { email } = fbResponse;
        const picture = fbResponse.picture.data.url;
        const password = 'facebook';
        connection.query('SELECT * FROM user WHERE email = ? AND provider = ?', [email, provider], (error, results, fields) => {
          if (error) throw error;
          if (results.length > 0) {
            const { id } = results[0];
            const access_token = jwt.sign({
              id, provider, name, email, picture,
            },
            secretKey, { expiresIn: '3600s' });
            const data = {
              data: {
                access_token,
                access_expired: 3600,
                user: {
                  id, provider, name, email, picture,
                },
              },
            };
            // console.log(data);
            res.json(data);
          } else {
            let post = {
              provider, name, email, picture, password,
            };
            db.query('INSERT INTO user SET ?', post, (error, results, fields) => {
              if (error) throw error;
              const id = results.insertId;
              const access_token = jwt.sign({
                id, provider, name, email, picture,
              },
              secretKey, { expiresIn: '3600s' });
              const data = {
                data: {
                  access_token,
                  access_expired: 3600,
                  user: {
                    id, provider, name, email, picture,
                  },
                },
              };
              res.json(data);
            });
          }
        });
      } else {
        const { email } = req.body;
        let { password } = req.body;
        // post = {provider: provider, name: name, email: email, picture: picture,};
        if (email && password) {
          password = crypto.createHash('sha256').update(req.body.password).digest('hex');
          connection.query('SELECT * FROM user WHERE email = ? AND password = ?', [email, password], (error, results, fields) => {
            if (error) throw error;
            if (results.length > 0) {
              const { id } = results[0];
              const { provider } = results[0];
              const { name } = results[0];
              const { picture } = results[0];
              const access_token = jwt.sign({
                id, provider, name, email, picture,
              },
              secretKey, { expiresIn: '3600s' });
              const data = {
                data: {
                  access_token,
                  access_expired: 3600,
                  user: {
                    id, provider, name, email, picture,
                  },
                },
              };
              // console.log(data);
              res.json(data);
            } else {
              const err = new Error();
              err.status = 403;
              err.error = 'Email or password is wrong, please check!';
              res.send(err);
            }
          });
        } else { // maybe useless if "input" add "require" in html
          const err = new Error();
          err.status = 400;
          err.error = 'Please enter your email and password';
          res.send(err);
        }
      }
      connection.release();
      if (error) throw error;
    });
  } catch (error) {
    error.status = 500;
    error.error = 'Something wrong in server...';
    res.send(error);
  }
});


router.get('/user/profile', verifyToken, (req, res) => {
  jwt.verify(req.token, secretKey, (err, data) => {
    if (err) {
      err.status = 403;
      err.error = 'incorrect token or token expired';
      res.send(err);
    } else {
      res.json({
        data,
      });
    }
  });
});
// FORMAT OF TOKEN
// Authorization: Bearer <access_token>
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers.authorization;
  // Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}


// function getJWT(data) {
//   let header = {
//     alg: 'HS256',
//     typ: 'JWT',
//   };
//   header = Buffer.from(JSON.stringify(header)).toString('base64');
//   let payload = data;
//   // set expired time = 60 mins
//   data.exp = Date.now() + 3600 * 1000; // ms
//   payload = header = Buffer.from(JSON.stringify(payload)).toString('base64');
//   const signature = crypto.createHmac('SHA256', secretKey)
//       .update(header + '.' + payload)
//       .digest('base64');
//   // const hmac = crypto.createHmac('SHA256', secret);
//   // const updatedHmac = hmac.update(header + '.' + payload)
//   // const signature = updatedHmac.digest('base64');
//   return header + '.' + payload + '.' + signature;
// }


module.exports = router;
