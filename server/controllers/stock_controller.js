require('dotenv').config();
const Stock = require('../models/stock_model');

const stockInfo = async (req, res) => {
  const result = await Stock.info();
  if (result.error) {
    res.status(403).send({ error: result.error });
    return;
  }
  res.status(200).send(result);
};

const stockStart = async (req, res) => {
  const { query } = req;
  const result = await Stock.start(query.name);
  if (result.error) {
    res.status(403).send({ error: result.error });
    return;
  }
  res.status(200).send(result);
};

const stockPk = async (req, res) => {
  const { body } = req;
  console.log(body);
  const result = await Stock.pk(body);
  if (result.error) {
    res.status(403).send({ error: result.error });
    return;
  }
  res.status(200).send(result);
};


const stockPrice = async (req, res) => {
  const { body } = req;
  // console.log(body);
  // let result = [];
  // for (let i = 0; i < body.playStock.length; i++)
  // {
  const result = await Stock.price(body.playDate, body.playStock);
  // }

  if (result.error) {
    res.status(403).send({ error: result.error });
    return;
  }
  res.status(200).send(result);
};

const stockNews = async (req, res) => {
  const { query } = req;
  // console.log(query);
  let result;
  if (query.href) {
    result = await Stock.crawlText(query.href);
  } else {
    result = await Stock.news(query.stock, query.start, query.end);
  }

  if (result.error) {
    res.status(403).send({ error: result.error });
    return;
  }
  res.status(200).send(result);
};

const stockRevenue = async (req, res) => {
  const { query } = req;
  // console.log(query);
  const result = await Stock.revenue(query.stock, query.date);
  if (result.error) {
    res.status(403).send({ error: result.error });
    return;
  }
  res.status(200).send(result);
};

const stockPer = async (req, res) => {
  const { query } = req;
  // console.log(query);
  const result = await Stock.per(query.stock, query.date);
  if (result.error) {
    res.status(403).send({ error: result.error });
    return;
  }
  res.status(200).send(result);
};

const stockEps = async (req, res) => {
  const { query } = req;
  // console.log(query);
  const result = await Stock.eps(query.stock, query.date);
  if (result.error) {
    res.status(403).send({ error: result.error });
    return;
  }
  res.status(200).send(result);
};

const stockResult = async (req, res) => {
  const { body } = req;
  // console.log(body);
  const result = await Stock.result(body.name, body.total_money_value,
    body.invest_ratio_value,
    body.total_ratio_value, body.portfolio, body.playStock,
    body.playDate, body.finishDate);

  if (result.error) {
    res.status(403).send({ error: result.error });
    return;
  }
  res.status(200).send(result);
};

const stockRank = async (req, res) => {
  const result = await Stock.rank();
  if (result.error) {
    res.status(403).send({ error: result.error });
    return;
  }
  res.status(200).send(result);
};

const stockValidate = async (req, res) => {
  const { query } = req;
  // console.log(query);
  const result = await Stock.validate(query.playdate, query.name,
    query.finishdate, query.playstock);
  if (result.error) {
    res.status(403).send({ error: result.error });
    return;
  }
  res.status(200).send(result);
};



module.exports = {
  stockInfo,
  stockStart,
  stockPk,
  stockPrice,
  stockNews,
  stockRevenue,
  stockPer,
  stockEps,
  stockResult,
  stockRank,
  stockValidate,
};
