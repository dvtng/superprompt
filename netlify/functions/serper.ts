import { Handler } from "@netlify/functions";
import "dotenv/config";
import fetch from "node-fetch";

export const handler: Handler = async (event) => {
  const query = event.queryStringParameters?.["q"];

  if (!query) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Missing query parameter q",
      }),
    };
  }

  const result = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "X-API-KEY": process.env.SERPER_API_KEY ?? "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: query,
    }),
  }).then((resp) => resp.text());

  return {
    statusCode: 200,
    body: result,
  };
};
