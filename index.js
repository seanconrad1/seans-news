// db2dfbb106b04632a1dc-cf3f32338c1

import express from "express";
import fetch from "node-fetch";
import { getRedditPosts } from "./utils/reddit-api.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;

const twelveDataApiKey = process.env.TWELVE_DATA_API_KEY;
const nYTimesApiKey = process.env.NY_TIMES_API_KEY;
const subreddits = ["science", "programming", "webdev", "technology"];
const tickers = ["AAPL", "TSLA", "NVDA", "AMZN"];
const NUMBER_OF_NEWS_STORIES = 3;

const getTickers = tickers.map(async (ticker) => {
  const ticketData = await fetch(
    `https://ticker-2e1ica8b9.now.sh/keyword/${ticker.toLowerCase()}`
  );
  const ticketDataJson = await ticketData.json();
  return ticketDataJson[0].name;
});

const companyNames = await Promise.all(getTickers);

const twelveDataURL = `https://api.twelvedata.com/time_series?symbol=${tickers.join(
  ","
)}&interval=1day&apikey=${twelveDataApiKey}`;

const nyTimes = `https://api.nytimes.com/svc/topstories/v2/world.json?api-key=
${nYTimesApiKey}`;

// Set up a route to handle a GET request
app.get("/news", async (req, res) => {
  try {
    // Fetch TwelveData API response
    const twelveDataResponse = await fetch(twelveDataURL);
    if (!twelveDataResponse.ok) {
      throw new Error(
        `Failed to fetch TwelveData: ${twelveDataResponse.statusText}`
      );
    }
    const twelveData = await twelveDataResponse.json();

    // Fetch NY Times API response
    const nyTimesResponse = await fetch(nyTimes);
    if (!nyTimesResponse.ok) {
      throw new Error(
        `Failed to fetch NY Times data: ${nyTimesResponse.statusText}`
      );
    }
    const nyTimesData = await nyTimesResponse.json();

    const responses = subreddits.map(async (subreddit) => {
      const redditData = await getRedditPosts(subreddit);
      return redditData;
    });

    const redditData = await Promise.all(responses);

    // const twelveDataObject = {
    //   AAPL: "233",
    //   TSLA: "222",
    //   NVDA: "140",
    //   AMZN: "188",
    // };

    const twelveDataObject = {};

    // Extract the high price for each stock
    Object.keys(twelveData).forEach((key) => {
      twelveDataObject[key] = Number(twelveData[key]?.values[0]?.high).toFixed(
        2
      );
    });

    // Extract keys and values
    const stockEntries = Object.entries(twelveDataObject);

    // Format the data into the desired string format
    const formattedStockPrices = stockEntries
      .map(([symbol, price], idx) => `${companyNames[idx]} ${price}`)
      .join(", ");

    const nyTimesObj = [
      ...nyTimesData.results.slice(0, NUMBER_OF_NEWS_STORIES),
    ];

    const sentence = `
      The stock prices are ${formattedStockPrices}
      <br><br>
      The top news stories are ${nyTimesObj
        .map((obj) => obj.title)
        .join(". <br><br>")}

      <br><br>

      Hot reddit posts:

      <br><br>
      ${redditData
        .map((post) => {
          const subreddit = post.data.children[0].data.subreddit;
          const title = post.data.children[0].data.title;
          const selftext = post.data.children[0].data.selftext;

          return `In r/${subreddit}, ${title}, ${selftext} `;
        })
        .join(".<br><br>")}
    
  `;

    res.send(sentence);
  } catch (error) {
    console.error("Error fetching data:", error.message);

    // Send a more specific error response to the client
    if (error.message.includes("TwelveData")) {
      res
        .status(500)
        .send("Error fetching stock market data. Please try again later.");
    } else if (error.message.includes("NY Times")) {
      res
        .status(500)
        .send("Error fetching news from NY Times. Please try again later.");
    } else {
      res
        .status(500)
        .send("An unexpected error occurred. Please try again later.");
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
