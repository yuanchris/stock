
// ======= env ========
require('dotenv').config('./');

// =======================

const express = require('express');
const bodyparser = require('body-parser');


const app = express();
const { PORT, API_VERSION } = process.env;


app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));


app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
// ======= static page =====
app.use(express.static(`${__dirname}/public`));


// CORS Control
app.use('/api/', function(req, res, next){
	res.set('Access-Control-Allow-Origin', '*');
	res.set('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization');
	res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
	res.set('Access-Control-Allow-Credentials', 'true');
	next();
});


// API routes
// const userRoute = require('./server/routes/user_route.js');
// app.use('/user', userRoute);
app.use(`/api/${API_VERSION}`,
[
	require('./server/routes/user_route'),
	require('./server/routes/stock_route'),
]
);



// Error handling
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send('Internal Server Error');
});

module.exports = app;
