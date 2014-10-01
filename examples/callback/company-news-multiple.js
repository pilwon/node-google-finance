var util = require('util');

require('colors');

var _ = require('lodash');
var googleFinance = require('../..');

var SYMBOLS = [
  'NASDAQ:AAPL',
  'NASDAQ:GOOGL',
  'NASDAQ:MSFT',
  'NASDAQ:YHOO',
  'NYSE:IBM',
  'NYSE:TWTR'
];

googleFinance.companyNews({
  symbols: SYMBOLS
}, function (err, result) {
  if (err) { throw err; }
  _.each(result, function (news, symbol) {
    console.log(util.format(
      '=== %s (%d) ===',
      symbol,
      news.length
    ).cyan);
    if (news[0]) {
      console.log(
        '%s\n...\n%s',
        JSON.stringify(news[0], null, 2),
        JSON.stringify(news[news.length - 1], null, 2)
      );
    } else {
      console.log('N/A');
    }
  });
});
