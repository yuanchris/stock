const router = require('express').Router();
const {wrapAsync} = require('../../util/util');

const {
  stockInfo,
  stockPrice,
  stockNews,
  stockRevenue,
  stockPer,
  stockEps,
  stockResult,
  stockRank,
  stockStart,
  stockPk,
  stockValidate,
} = require('../controllers/stock_controller');

// router.route('/user/signup')
//     .post(wrapAsync(signUp));

// router.route('/user/signin')
//     .post(wrapAsync(signIn));

router.route('/stock/info')
  .get(wrapAsync(stockInfo));

router.route('/stock/start')
  .get(wrapAsync(stockStart));

router.route('/stock/pk')
  .post(wrapAsync(stockPk));

router.route('/stock/news')
  .get(wrapAsync(stockNews));

router.route('/stock/revenue')
  .get(wrapAsync(stockRevenue));

router.route('/stock/per')
  .get(wrapAsync(stockPer));

router.route('/stock/eps')
  .get(wrapAsync(stockEps));

router.route('/stock/price')
  .post(wrapAsync(stockPrice));

router.route('/stock/result')
  .post(wrapAsync(stockResult))
  .get(wrapAsync(stockRank));


  router.route('/stock/validate')
  .get(wrapAsync(stockValidate));

module.exports = router;