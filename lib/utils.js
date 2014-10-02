var url = require('url');
var util = require('util');

var _ = require('lodash');
var S = require('string');
var debug = require('debug')('google-finance:utils');
var FeedParser = require('feedparser');
var Promise = require('bluebird');
var request = require('request');

request = Promise.promisifyAll(request);

function camelize(text) {
  return S(text)
    .slugify()
    .camelize()
    .s;
}

function download(uri, qs) {
  debug(url.format({pathname: uri, query: qs}));
  return request.getAsync({
    uri: uri,
    qs: qs
  }).spread(function (res, body) {
    if (res.statusCode === 200) {
      return body;
    } else {
      throw new Error(util.format('status %d', res.statusCode));
    }
  });
}

function downloadRSS(uri, qs) {
  debug(url.format({pathname: uri, query: qs}));
  return new Promise(function (resolve, reject) {
    var parser = new FeedParser();
    var result = [];

    var req = request({
      uri: uri,
      qs: qs
    });

    req
      .on('error', function (err) {
        reject(err);
      })
      .on('response', function (res) {
        if (res.statusCode !== 200) {
          return reject(new Error(util.format('status %d', res.statusCode)));
        }
        this.pipe(parser);
      });

    parser
      .on('error', function (err) {
        reject(err);
      })
      .on('end', function () {
        resolve(result);
      })
      .on('readable', function () {
        var item;
        while (item = this.read()) {
          result.push(item);
        }
      });
  });
}

function getDateRanges(from, to) {
  var result = [];
  var d = from.clone();

  while (true) {
    var d2 = d.clone().add(10, 'years').subtract(1, 'days');
    if (d2.isAfter(to)) {
      result.push({
        from: d.clone(),
        to: to.clone()
      });
      break;
    } else {
      result.push({
        from: d.clone(),
        to: d2.clone()
      });
    }
    d = d2.add(1, 'days');
  }

  return result;
}

function parseCSV(text) {
  return S(text).trim().s.split('\n').map(function (line) {
    return S(line).trim().parseCSV();
  });
}

function toDate(value, valueForError) {
  try {
    var date = new Date(value);
    if (date.getFullYear() < 1400) { return null; }
    return date;
  } catch (err) {
    if (_.isUndefined(valueForError)) {
      return null;
    } else {
      return valueForError;
    }
  }
}

function toFloat(value, valueForNaN) {
  var result = parseFloat(value);
  if (isNaN(result)) {
    if (_.isUndefined(valueForNaN)) {
      return null;
    } else {
      return valueForNaN;
    }
  } else  {
    return result;
  }
}

function toInt(value, valueForNaN) {
  var result = parseInt(value, 10);
  if (isNaN(result)) {
    if (_.isUndefined(valueForNaN)) {
      return null;
    } else {
      return valueForNaN;
    }
  } else  {
    return result;
  }
}

exports.camelize = camelize;
exports.download = download;
exports.downloadRSS = downloadRSS;
exports.getDateRanges = getDateRanges;
exports.parseCSV = parseCSV;
exports.toDate = toDate;
exports.toFloat = toFloat;
exports.toInt = toInt;
