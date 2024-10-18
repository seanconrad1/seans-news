// db2dfbb106b04632a1dc-cf3f32338c1

const fetch = require("node-fetch");
const express = require("express");
const app = express();
const port = 3000;
require("dotenv").config();

// https://api.twelvedata.com/time_series?symbol=AAPL,EUR/USD,ETH/BTC:Huobi,TRP:TSX&interval=1min&apikey=your_api_key

const twelveDataApiKey = process.env.TWELVE_DATA_API_KEY;
const nYTimesApiKey = process.env.NY_TIMES_API_KEY;

const twelveDataURL = `https://api.twelvedata.com/time_series?symbol=AAPL,TSLA,NVDA,AMZN&interval=1day&apikey=${twelveDataApiKey}`;

const nyTimes = `https://api.nytimes.com/svc/topstories/v2/world.json?api-key=
${nYTimesApiKey}`;

const filter = "top";
const redditURL1 = `https://www.reddit.com/r/science/${filter}/.json`;
const redditURL2 = `https://www.reddit.com/r/programming/${filter}/.json`;
const redditURL3 = `https://www.reddit.com/r/webdev/${filter}/.json`;
const redditURL4 = `https://www.reddit.com/r/technology/${filter}/.json`;

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
};

// [/r/subreddit]/sortreadrss support
// → [/r/subreddit]/top
// → [/r/subreddit]/controversial

// Step 4: Set up a route to handle a GET request
app.get("/news", async (req, res) => {
  // const twelveDataRepsponse = await fetch(twelveDataURL);
  // const twelveData = await twelveDataRepsponse.json();
  // const nyTimesResponse = await fetch(nyTimes);
  // const nyTimesData = await nyTimesResponse.json();

  // const redditResponse1 = await fetch(redditURL1, { headers });
  // const redditData1 = await redditResponse1.json(
  //   JSON.stringify(redditResponse1)
  // );

  // const redditResponse2 = await fetch(redditURL2, { headers });
  // const redditData2 = await redditResponse2.json(
  //   JSON.stringify(redditResponse2)
  // );

  // const redditResponse3 = await fetch(redditURL3, { headers });
  // const redditData3 = await redditResponse3.json(
  //   JSON.stringify(redditResponse3)
  // );

  // const redditResponse4 = await fetch(redditURL4, { headers });
  // const redditData4 = await redditResponse4.json(
  //   JSON.stringify(redditResponse4)
  // );

  // const twelveDataObject = {
  //   AAPL: "233",
  //   TSLA: "222",
  //   NVDA: "140",
  //   AMZN: "188",
  // };
  const twelveDataObject = {};

  Object.keys(twelveData).forEach((key) => {
    twelveDataObject[key] = Number(twelveData[key]?.values[0]?.high).toFixed(2);
  });

  // Step 2: Extract keys and values
  const stockEntries = Object.entries(twelveDataObject);

  // Step 3: Format the data into the desired string format
  const formattedStockPrices = stockEntries
    .map(([symbol, price]) => `${symbol} ${price}`)
    .join(", ");

  const nyTimesObj = [nyTimesData.results[0], nyTimesData.results[1]];

  // Hot reddit posts:
  // r/${redditData1.data.children[0].data.subreddit}: ${
  //   redditData1.data.children[0].data.title
  // }
  // ${redditData1.data.children[0].data.selftext}

  // r/${redditData2.data.children[0].data.subreddit}: ${
  //   redditData2.data.children[0].data.title
  // }
  // ${redditData2.data.children[0].data.selftext}

  // r/${redditData3.data.children[0].data.subreddit}: ${
  //   redditData3.data.children[0].data.title
  // }
  // ${redditData3.data.children[0].data.selftext}

  // r/${redditData4.data.children[0].data.subreddit}: ${
  //   redditData4.data.children[0].data.title
  // }
  // ${redditData4.data.children[0].data.selftext}

  const sentence = `

  The top news stories are ${nyTimesObj.map((obj) => obj.title).join(",")}

  The stock prices are ${formattedStockPrices}

  `;

  res.send(sentence);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
