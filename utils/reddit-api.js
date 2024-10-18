import fetch from "node-fetch";
import util from "util";

export const getRedditPosts = async (subreddit) => {
  try {
    const options = {
      method: "GET",
      headers: {
        Cookie:
          "csv=2; edgebucket=LAiRL6HEwqLJXVceFk; loid=000000001b465w4vjk.2.1729272246308.Z0FBQUFBQm5FcG0yMlRCSmlKSHc2Z3FRaDFDQjFoYXFMd2JycS1WMWE2TXF0WUt2RXBiV2UwQmYtelRjdUNsUjlvZUQtdzI3WWRIdVlqdldDMlVpLXRLVlhkTEhEUlh1R1Fnc1NSYkZnREJsV1pnakpHajZFWl9SN3ZBUzFkbUx0QUN2VjM1dEY1ZzA; session_tracker=hffmlargnkkcajaonb.0.1729272246319.Z0FBQUFBQm5FcG0yd25XWV8tNmNjeVp3UzgydzczX2EzMFBUVGN2V1hGanR3NHVmWjV3bVRZcTlkaS1rRkxCTUtMZzYzVHdrQUJqN1BQQkpmM2kxRDdpVmpEd2U2OE1DbHppNUthdDk5bF9ta1VINXN0QTZuN1BVRHdMYzlPNUlCSnRGaWlGUDd1eDA",
      },
    };

    const response = await fetch(
      `https://www.reddit.com/r/${subreddit}/top/.json`,
      options
    );
    if (!response.ok)
      throw new Error(
        `Failed to fetch data for /r/${subreddit}: ${util.inspect(response)}`
      );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch data for /r/${subreddit}: ${error}`);
  }
};
