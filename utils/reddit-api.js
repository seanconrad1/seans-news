import fetch from "node-fetch";
export const getRedditPosts = async (subreddit) => {
  try {
    const response = await fetch(
      `https://www.reddit.com/r/${subreddit}/top/.json`,
      {
        headers: {
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-language": "en-US,en;q=0.9",
          "cache-control": "max-age=0",
          priority: "u=0, i",
          "sec-ch-ua":
            '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "none",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1",
        },
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
      }
    );
    if (!response.ok)
      throw new Error(
        `Failed to fetch data for /r/${subreddit}: ${response.statusText}`
      );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch data for /r/${subreddit}: ${error}`);
  }
};
