const users = [
  {
      provider: 'native',
      email: 'test1@gmail.com',
      password: 'test1password',
      name: 'test1',
      picture: null,

  },
  {
      provider: 'facebook',
      email: 'test2@gmail.com',
      password: null,
      name: 'test2',
      picture: 'https://graph.facebook.com/1/picture?type=large',
  },
  {
      provider: 'native',
      email: 'test3@gmail.com',
      password: 'test3passwod',
      name: 'test3',
      picture: null,
  },
];




const user_playlist = [
  {
    name: 'test',
    totalmoney: '2026.98',
    invest_ratio: '1.35',
    total_ratio: '1.35',
    portfolio: '{"list":[{"stock_id":"1907","stock_name":"永豐餘","price":10.7,"qty":"158","total_price":1690.6,"buyShort_value":"short","now_price_value":10.1},\
    {"stock_id":"2038","stock_name":"海光","price":8.02,"qty":"900","total_price":7218,"buyShort_value":"buy","now_price_value":8.08},\
    {"stock_id":"2616","stock_name":"山隆","price":34,"qty":"100","total_price":3400,"buyShort_value":"buy","now_price_value":34.19},\
    {"stock_id":"2882","stock_name":"國泰金","price":48.4,"qty":"100","total_price":4840,"buyShort_value":"short","now_price_value":49.29},\
    {"stock_id":"3231","stock_name":"緯創","price":28.5,"qty":"100","total_price":2850,"buyShort_value":"buy","now_price_value":30.41}],"total":19998.6}',
    playstock: '[{"id":1907,"stock":"永豐餘","industry":"造紙工業"},{"id":2038,"stock":"海光","industry":"鋼鐵工業"},\
    {"id":2616,"stock":"山隆","industry":"油電燃氣業"},{"id":2882,"stock":"國泰金","industry":"金融保險業"},{"id":3231,"stock":"緯創","industry":"電腦及週邊設備業"}]',
    playdate: '2017-04-30',
    finishdate: '1595911602276',
    opponent: 'chris',
  },
  {
    name: 'chris',
    totalmoney: '1973.98',
    invest_ratio: '-1.35',
    total_ratio: '-1.35',
    portfolio: '{"list":[{"stock_id":"1907","stock_name":"永豐餘","price":10.7,"qty":"158","total_price":1690.6,"buyShort_value":"short","now_price_value":10.1},\
    {"stock_id":"2038","stock_name":"海光","price":8.02,"qty":"900","total_price":7218,"buyShort_value":"buy","now_price_value":8.08},\
    {"stock_id":"2616","stock_name":"山隆","price":34,"qty":"100","total_price":3400,"buyShort_value":"buy","now_price_value":34.19},\
    {"stock_id":"2882","stock_name":"國泰金","price":48.4,"qty":"100","total_price":4840,"buyShort_value":"short","now_price_value":49.29},\
    {"stock_id":"3231","stock_name":"緯創","price":28.5,"qty":"100","total_price":2850,"buyShort_value":"buy","now_price_value":30.41}],"total":19998.6}',
    playstock: '[{"id":1907,"stock":"永豐餘","industry":"造紙工業"},{"id":2038,"stock":"海光","industry":"鋼鐵工業"},\
    {"id":2616,"stock":"山隆","industry":"油電燃氣業"},{"id":2882,"stock":"國泰金","industry":"金融保險業"},{"id":3231,"stock":"緯創","industry":"電腦及週邊設備業"}]',
    playdate: '2017-04-30',
    finishdate: '1595911602276',
    opponent: 'test',
  },
  {
    name: '蕭丁元',
    totalmoney: 2285.54,
    invest_ratio: 14.45,
    total_ratio: 14.28,
    portfolio: '{"list":[{"stock_id":"2408","stock_name":"南亞科","price":40.3,"qty":"200","total_price":8060,"buyShort_value":"buy","now_price_value":38.59},{"stock_id":"2430","stock_name":"燦坤","price":19.4,"qty":"300","total_price":5820,"buyShort_value":"buy","now_price_value":22.53},{"stock_id":"2105","stock_name":"正新","price":48.95,"qty":"120","total_price":5874,"buyShort_value":"buy","now_price_value":67.77}],"total":19754}',
    playstock: '[{"id":1712,"stock":"興農","industry":"化學工業"},{"id":1805,"stock":"寶徠","industry":"建材營造業"},{"id":2105,"stock":"正新","industry":"橡膠工業"},{"id":2408,"stock":"南亞科","industry":"半導體業"},{"id":2430,"stock":"燦坤","industry":"電子通路業"}]',
    playdate: '2016-01-22',
    finishdate: '1596440014261',
    opponent: '徐宣哲',
  },
  {
    name: '徐宣哲',
    totalmoney: 2261.65,
    invest_ratio: 13.49,
    total_ratio: 13.08,
    portfolio: '{"list":[{"stock_id":"1712","stock_name":"興農","price":12.8,"qty":"750","total_price":9600,"buyShort_value":"short","now_price_value":14.33},{"stock_id":"2105","stock_name":"正新","price":48.95,"qty":"200","total_price":9790,"buyShort_value":"buy","now_price_value":67.77}],"total":19390}',
    playstock: '[{"id":1712,"stock":"興農","industry":"化學工業"},{"id":1805,"stock":"寶徠","industry":"建材營造業"},{"id":2105,"stock":"正新","industry":"橡膠工業"},{"id":2408,"stock":"南亞科","industry":"半導體業"},{"id":2430,"stock":"燦坤","industry":"電子通路業"}]',
    playdate: '2016-01-22',
    finishdate: '1596440014261',
    opponent: '蕭丁元',
  },
];

module.exports = {
  users,
  user_playlist,
};