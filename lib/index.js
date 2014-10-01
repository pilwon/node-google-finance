var assert = require('assert');
var os = require('os');
var util = require('util');

var _ = require('lodash');
var S = require('string');
var moment = require('moment');
var Promise = require('bluebird');

var _constants = require('./constants');
var _utils = require('./utils');

function _sanitizeCompanyNews(options) {
  assert(_.isPlainObject(options),
         '"options" must be a plain object.');
  assert(!_.isUndefined(options.symbol) || !_.isUndefined(options.symbols),
         'Either "options.symbol" or "options.symbols" must be defined.');
  assert(_.isUndefined(options.symbol) || _.isUndefined(options.symbols),
         'Either "options.symbol" or "options.symbols" must be undefined.');
  assert(_.isUndefined(options.error) || _.isBoolean(options.error),
         '"options.error" must be a boolean value');

  if (!_.isUndefined(options.symbol)) {
    assert((_.isString(options.symbol) && !_.isEmpty(options.symbol)),
           '"options.symbol" must be a non-empty string.');
  } else {
    assert((_.isArray(options.symbols) && !_.isEmpty(options.symbols)),
           '"options.symbols" must be a non-empty string array.');
  }
}

function _sanitizeHistorical(options) {
  assert(_.isPlainObject(options),
         '"options" must be a plain object.');
  assert(!_.isUndefined(options.symbol) || !_.isUndefined(options.symbols),
         'Either "options.symbol" or "options.symbols" must be defined.');
  assert(_.isUndefined(options.symbol) || _.isUndefined(options.symbols),
         'Either "options.symbol" or "options.symbols" must be undefined.');
  assert(_.isUndefined(options.error) || _.isBoolean(options.error),
         '"options.error" must be a boolean value');

  if (!_.isUndefined(options.symbol)) {
    assert((_.isString(options.symbol) && !_.isEmpty(options.symbol)),
           '"options.symbol" must be a non-empty string.');
  } else {
    assert((_.isArray(options.symbols) && !_.isEmpty(options.symbols)),
           '"options.symbols" must be a non-empty string array.');
  }

  if (_.isString(options.from) && !_.isEmpty(options.from)) {
    options.from = moment(options.from);
    assert(options.from.isValid(), '"options.from" must be a valid date string.');
  } else {
    assert(_.isDate(options.from) || _.isUndefined(options.from) || _.isNull(options.from),
           '"options.from" must be a date or undefined/null.');
    if (_.isDate(options.from)) {
      options.from = moment(options.from);
    }
  }

  if (_.isString(options.to) && !_.isEmpty(options.to)) {
    options.to = moment(options.to);
    assert(options.to.isValid(), '"options.to" must be a valid date string.');
  } else {
    assert(_.isDate(options.to) || _.isUndefined(options.to) || _.isNull(options.to),
           '"options.to" must be a date or undefined/null.');
    if (_.isDate(options.to)) {
      options.to = moment(options.to);
    }
  }

  if (!options.from) {
    options.from = moment('1900-01-01');
  }

  if (!options.to) {
    options.to = moment({ hour: 0 });
  }

  assert((!options.from && !options.to) || !options.from.isAfter(options.to),
         '"options.to" must be be greater than or equal to "options.from".');
}

function _transformCompanyNews(symbol, data) {
  return _(data)
    .sortBy(function (item) {
      return item.date;
    })
    .map(function (item) {
      var splits = item.guid.split(':');
      return {
        id: splits[splits.length - 1],
        symbol: symbol,
        title: S(item.title).stripTags().trim().decodeHTMLEntities().s,
        description: S(item.description).stripTags().trim().decodeHTMLEntities().s,
        summary: S(item.summary).stripTags().trim().decodeHTMLEntities().s,
        date: item.date,
        link: item.link
      };
    })
    .value();
}

function _transformHistorical(symbol, data) {
  var headings = data.shift();
  return _(data)
    .reverse()
    .map(function (line) {
      var result = {};
      headings.forEach(function (heading, i) {
        var value = line[i];
        if (_.contains(['Volume'], heading)) {
          value = _utils.toInt(value, null);
        } else if (_.contains(['Open', 'High', 'Low', 'Close'], heading)) {
          value = _utils.toFloat(value, null);
        } else if (_.contains(['Date'], heading)) {
          value = _utils.toDate(value, null);
          if (value && !moment(value).isValid()) {
            value = null;
          }
        }
        result[_utils.camelize(heading)] = value;
      });
      result.symbol = symbol;
      return result;
    })
    .value();
}

function companyNews(options, cb) {
  if (_.isUndefined(options)) { options = {}; }
  _sanitizeCompanyNews(options);

  var symbols = options.symbols || _.flatten([options.symbol]);

  return Promise.resolve(symbols)
    .map(function (symbol) {
      return Promise.resolve()
        .then(function () {
          return _utils.downloadRSS(_constants.COMPANY_NEWS_URL, {
            output: 'rss',
            q: symbol
          });
        })
        .then(function (data) {
          return _transformCompanyNews(symbol, data);
        })
        .catch(function (err) {
          if (options.error) {
            throw err;
          } else {
            return [];
          }
        });
    }, {concurrency: os.cpus().length})
    .then(function (result) {
      if (options.symbols) {
        return _.zipObject(symbols, result);
      } else {
        return result[0];
      }
    })
    .catch(function (err) {
      throw new Error(util.format('Failed to download data (%s)', err.message));
    })
    .nodeify(cb);
}

function historical(options, cb) {
  if (_.isUndefined(options)) { options = {}; }
  _sanitizeHistorical(options);

  var symbols = options.symbols || _.flatten([options.symbol]);

  return Promise.resolve(symbols)
    .map(function (symbol) {
      return Promise.resolve()
        .then(function () {
          return _utils.download(_constants.HISTORICAL_URL, {
            q: symbol,
            startdate: options.from.format('YYYY-MM-DD'),
            enddate: options.to.format('YYYY-MM-DD'),
            output: 'csv'
          });
        })
        .then(_utils.parseCSV)
        .then(function (data) {
          return _transformHistorical(symbol, data);
        })
        .catch(function (err) {
          if (options.error) {
            throw err;
          } else {
            return [];
          }
        });
    }, {concurrency: os.cpus().length})
    .then(function (result) {
      if (options.symbols) {
        return _.zipObject(symbols, result);
      } else {
        return result[0];
      }
    })
    .catch(function (err) {
      throw new Error(util.format('Failed to download data (%s)', err.message));
    })
    .nodeify(cb);
}

exports.companyNews = companyNews;
exports.historical = historical;
