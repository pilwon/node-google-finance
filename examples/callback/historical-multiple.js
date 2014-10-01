var util = require('util');

require('colors');

var _ = require('lodash');
var googleFinance = require('../..');

var SYMBOLS = [
  'NASDAQ:AAPL',
  'NASDAQ:AMZN',
  'NASDAQ:GOOGL',
  'NASDAQ:YHOO'
];
var FROM = '2014-01-01';
var TO = '2014-12-31';

googleFinance.historical({
  symbols: SYMBOLS,
  from: FROM,
  to: TO
}, function (err, result) {
  if (err) { throw err; }
  _.each(result, function (quotes, symbol) {
    console.log(util.format(
      '=== %s (%d) ===',
      symbol,
      quotes.length
    ).cyan);
    if (quotes[0]) {
      console.log(
        '%s\n...\n%s',
        JSON.stringify(quotes[0], null, 2),
        JSON.stringify(quotes[quotes.length - 1], null, 2)
      );
    } else {
      console.log('N/A');
    }
  });
});
