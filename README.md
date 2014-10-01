# google-finance

`google-finance` is [Google Finance](http://finance.google.com/) company news and historical quotes data downloader written in [Node.js](http://nodejs.org/).

The library handles fetching, parsing, and cleaning of CSV data and returns JSON result that is convenient and easy to work with. Both callback (last parameter) and promises (using [Bluebird](https://github.com/petkaantonov/bluebird)) styles are supported.


## Installation

    $ npm install google-finance


## Usage

```js
var googleFinance = require('google-finance');

googleFinance.companyNews({
  symbol: 'NASDAQ:AAPL'
}, function (err, news) {
  //...
});

googleFinance.historical({
  symbol: 'NASDAQ:AAPL',
  from: '2014-01-01',
  to: '2014-12-31'
}, function (err, quotes) {
  //...
});
```

* [See more comprehensive examples here.](https://github.com/pilwon/node-google-finance/tree/master/examples)


## API

### Download Company News Data (single symbol)

```js
googleFinance.companyNews({
  symbol: SYMBOL
}, function (err, news) {
  /*
  [
    {
      "id": "52778621773856",
      "symbol": "NASDAQ:AAPL",
      "title": "After Apple Inc. dodged the iPhone 6 Plus BendGate bullet, detractors wounded ...",
      "description": "After Apple Inc. dodged the iPhone 6 Plus BendGate bullet, detractors wounded ...\n Apple Insider - Sep 27, 2014 \nWith new, larger iPhone 6 models now hitting the market, one Samsung executive reportedly acknowledged that \"the positive reaction from consumers to those two Apple devices\" forced the company to rush its Note 4 launch ahead of schedule, adding \"it's ...\nWill Apple's 'Bendgate' Give Samsung, BlackBerry An Opening? - Seeking Alpha (registration)",
      "summary": "After Apple Inc. dodged the iPhone 6 Plus BendGate bullet, detractors wounded ...\n Apple Insider - Sep 27, 2014 \nWith new, larger iPhone 6 models now hitting the market, one Samsung executive reportedly acknowledged that \"the positive reaction from consumers to those two Apple devices\" forced the company to rush its Note 4 launch ahead of schedule, adding \"it's ...\nWill Apple's 'Bendgate' Give Samsung, BlackBerry An Opening? - Seeking Alpha (registration)",
      "date": "2014-09-27T06:23:41.000Z",
      "link": "http://appleinsider.com/articles/14/09/27/after-apple-inc-dodged-the-iphone-6-plus-bendgate-bullet-detractors-wounded-by-ricochet"
    }
    ...
    {
      "id": "//www.fool.com/investing/general/2014/10/01/the-death-of-apple-incs-i.aspx",
      "symbol": "NASDAQ:AAPL",
      "title": "The Death of Apple, Inc's \"i\" Branding",
      "description": "The Death of Apple, Inc's \"i\" Branding\n Motley Fool - 27 minutes ago \nIn a recent blog post, he notes that neither of the two new products Apple unveiled earlier this month carried the iBranding, with the company instead opting for \"Apple Pay \"and \"Apple Watch.\" Segall believes that the only explanation for this is that ...",
      "summary": "The Death of Apple, Inc's \"i\" Branding\n Motley Fool - 27 minutes ago \nIn a recent blog post, he notes that neither of the two new products Apple unveiled earlier this month carried the iBranding, with the company instead opting for \"Apple Pay \"and \"Apple Watch.\" Segall believes that the only explanation for this is that ...",
      "date": "2014-10-01T21:45:00.000Z",
      "link": "http://www.fool.com/investing/general/2014/10/01/the-death-of-apple-incs-i.aspx"
    }
  ]
  */
});
```

### Download Company News Data (multiple symbols)

```js
googleFinance.companyNews({
  symbols: [SYMBOL1, SYMBOL2]
}, function (err, news) {
  /*
  {
    "NASDAQ:AAPL": [
      {
        "id": "52778621773856",
        "symbol": "NASDAQ:AAPL",
        "title": "After Apple Inc. dodged the iPhone 6 Plus BendGate bullet, detractors wounded ...",
        "description": "After Apple Inc. dodged the iPhone 6 Plus BendGate bullet, detractors wounded ...\n Apple Insider - Sep 27, 2014 \nWith new, larger iPhone 6 models now hitting the market, one Samsung executive reportedly acknowledged that \"the positive reaction from consumers to those two Apple devices\" forced the company to rush its Note 4 launch ahead of schedule, adding \"it's ...\nWill Apple's 'Bendgate' Give Samsung, BlackBerry An Opening? - Seeking Alpha (registration)",
        "summary": "After Apple Inc. dodged the iPhone 6 Plus BendGate bullet, detractors wounded ...\n Apple Insider - Sep 27, 2014 \nWith new, larger iPhone 6 models now hitting the market, one Samsung executive reportedly acknowledged that \"the positive reaction from consumers to those two Apple devices\" forced the company to rush its Note 4 launch ahead of schedule, adding \"it's ...\nWill Apple's 'Bendgate' Give Samsung, BlackBerry An Opening? - Seeking Alpha (registration)",
        "date": "2014-09-27T06:23:41.000Z",
        "link": "http://appleinsider.com/articles/14/09/27/after-apple-inc-dodged-the-iphone-6-plus-bendgate-bullet-detractors-wounded-by-ricochet"
      }
      ...
      {
        "id": "//www.fool.com/investing/general/2014/10/01/the-death-of-apple-incs-i.aspx",
        "symbol": "NASDAQ:AAPL",
        "title": "The Death of Apple, Inc's \"i\" Branding",
        "description": "The Death of Apple, Inc's \"i\" Branding\n Motley Fool - 29 minutes ago \nIn a recent blog post, he notes that neither of the two new products Apple unveiled earlier this month carried the iBranding, with the company instead opting for \"Apple Pay \"and \"Apple Watch.\" Segall believes that the only explanation for this is that ...",
        "summary": "The Death of Apple, Inc's \"i\" Branding\n Motley Fool - 29 minutes ago \nIn a recent blog post, he notes that neither of the two new products Apple unveiled earlier this month carried the iBranding, with the company instead opting for \"Apple Pay \"and \"Apple Watch.\" Segall believes that the only explanation for this is that ...",
        "date": "2014-10-01T21:45:00.000Z",
        "link": "http://www.fool.com/investing/general/2014/10/01/the-death-of-apple-incs-i.aspx"
      }
    ],
    "NYSE:TWTR": [
      {
        "id": "//www.benzinga.com/tech/14/09/4854209/why-is-twitter-inc-borrowing-more-money",
        "symbol": "NYSE:TWTR",
        "title": "Why Is Twitter Inc Borrowing More Money?",
        "description": "Why Is Twitter Inc Borrowing More Money?\n Benzinga - Sep 16, 2014 \nTwitter Inc (NYSE: TWTR) is borrowing $1.5 billion to expand the business, but is it wise for the company to take on new debt?",
        "summary": "Why Is Twitter Inc Borrowing More Money?\n Benzinga - Sep 16, 2014 \nTwitter Inc (NYSE: TWTR) is borrowing $1.5 billion to expand the business, but is it wise for the company to take on new debt?",
        "date": "2014-09-16T21:22:30.000Z",
        "link": "http://www.benzinga.com/tech/14/09/4854209/why-is-twitter-inc-borrowing-more-money"
      }
      ...
      {
        "id": "52778622630300",
        "symbol": "NYSE:TWTR",
        "title": "Making Twitter Inc (TWTR) A Friendly Place",
        "description": "Making Twitter Inc (TWTR) A Friendly Place\n ETF Daily News - 5 hours ago \ntwitter Discussing the problems Twitter Inc (NYSE:TWTR) faces within the social media network, with author of “Hatching Twitter” Nick Bilton.\nDrama at Twitter Inc (TWTR) Has Subsided Under The New Management: Nick ... - Insider Monkey (blog)",
        "summary": "Making Twitter Inc (TWTR) A Friendly Place\n ETF Daily News - 5 hours ago \ntwitter Discussing the problems Twitter Inc (NYSE:TWTR) faces within the social media network, with author of “Hatching Twitter” Nick Bilton.\nDrama at Twitter Inc (TWTR) Has Subsided Under The New Management: Nick ... - Insider Monkey (blog)",
        "date": "2014-10-01T16:18:45.000Z",
        "link": "http://etfdailynews.com/2014/10/01/making-twitter-inc-twtr-a-friendly-place/"
      }
    ]
  }
  */
});
```

### Download Historical Data (single symbol)

```js
googleFinance.historical({
  symbol: SYMBOL,
  from: START_DATE,
  to: END_DATE
}, function (err, quotes) {
  /*
  [
    {
      "date": "2014-01-02T05:00:00.000Z",
      "open": 79.38,
      "high": 79.58,
      "low": 78.86,
      "close": 79.02,
      "volume": 58791957,
      "symbol": "NASDAQ:AAPL"
    }
    ...
    {
      "date": "2014-10-01T04:00:00.000Z",
      "open": 100.59,
      "high": 100.69,
      "low": 98.7,
      "close": 99.18,
      "volume": 51304344,
      "symbol": "NASDAQ:AAPL"
    }
  ]
  */
});
```

### Download Historical Data (multiple symbols)

```js
googleFinance.historical({
  symbols: [SYMBOL1, SYMBOL2],
  from: START_DATE,
  to: END_DATE
}, function (err, result) {
  /*
  {
    "NASDAQ:GOOGL": [
      {
        "date": "2014-01-02T05:00:00.000Z",
        "open": 558.29,
        "high": 559.43,
        "low": 554.68,
        "close": 557.12,
        "volume": 1822719,
        "symbol": "NASDAQ:GOOGL"
      }
      ...
      {
        "date": "2014-10-01T04:00:00.000Z",
        "open": 586.8,
        "high": 588.72,
        "low": 578.02,
        "close": 579.63,
        "volume": 1444055,
        "symbol": "NASDAQ:GOOGL"
      }
    ],
    "NASDAQ:YHOO": [
      {
        "date": "2014-01-02T05:00:00.000Z",
        "open": 40.37,
        "high": 40.49,
        "low": 39.31,
        "close": 39.59,
        "volume": 21514650,
        "symbol": "NASDAQ:YHOO"
      }
      ...
      {
        "date": "2014-10-01T04:00:00.000Z",
        "open": 40.66,
        "high": 41.24,
        "low": 40.11,
        "close": 40.32,
        "volume": 35130364,
        "symbol": "NASDAQ:YHOO"
      }
    ],
    ...
  }
  */
});
```


## Credits

  See the [contributors](https://github.com/pilwon/node-google-finance/graphs/contributors).


## License

<pre>
The MIT License (MIT)

Copyright (c) 2014 Pilwon Huh

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
</pre>

[![Analytics](https://ga-beacon.appspot.com/UA-47034562-6/node-google-finance/readme?pixel)](https://github.com/pilwon/node-google-finance)
