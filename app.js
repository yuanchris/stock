
// ======= env ========
require('dotenv').config('./');

// =======================

const express = require('express');

const app = express();
const bodyparser = require('body-parser');
const fetch = require('node-fetch');

const { PORT, API_VERSION, IP } = process.env;

const path = require('path');
const hbs = require('express-hbs');

app.engine('hbs', hbs.express4({
  partialsDir: `${__dirname}/views/partials`,
}));
app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// ========

const http = require('http').createServer(app);

const io = require('socket.io')(http);
const socket = require('./socket.js');

socket.start(io);
http.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// ======= static page =====
app.use(express.static(`${__dirname}/public`));
// ===== room page =======
app.get('/room/:roomID', (req, res) => {
  const { roomID } = req.params;
  res.render('room', {
    roomID,
    users: socket.roomInfo[roomID],
  });
});

// CORS Control
app.use('/api/', (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization');
  res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.set('Access-Control-Allow-Credentials', 'true');
  next();
});


// API routes
app.use(`/api/${API_VERSION}`,
  [
    require('./server/routes/user_route'),
    require('./server/routes/stock_route'),
  ]);


// Error handling
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send('Internal Server Error');
});

module.exports = app;
