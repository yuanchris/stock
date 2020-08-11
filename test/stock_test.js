require('dotenv');
const { assert, requester } = require('./set_up');

const { PORT } = process.env;

describe('stock', async () => {
  it('select all playlist', async () => {
    const res = await requester
      .get('/api/1.0/stock/result');

    const data = res.body;
    assert.equal(data.length, 4);

    const playlist2Expect = {
      id: 4,
      name: '徐宣哲',
      totalmoney: 2261.65,
      invest_ratio: 13.49,
      total_ratio: 13.08,
      portfolio: '{"list":[{"stock_id":"1712","stock_name":"興農","price":12.8,"qty":"750","total_price":9600,"buyShort_value":"short","now_price_value":14.33},{"stock_id":"2105","stock_name":"正新","price":48.95,"qty":"200","total_price":9790,"buyShort_value":"buy","now_price_value":67.77}],"total":19390}',
      playstock: '[{"id":1712,"stock":"興農","industry":"化學工業"},{"id":1805,"stock":"寶徠","industry":"建材營造業"},{"id":2105,"stock":"正新","industry":"橡膠工業"},{"id":2408,"stock":"南亞科","industry":"半導體業"},{"id":2430,"stock":"燦坤","industry":"電子通路業"}]',
      playdate: '2016-01-22',
      finishdate: '1596440014261',
      opponent: '蕭丁元',
    };

    assert.deepStrictEqual(data[1], playlist2Expect);
  });
});
