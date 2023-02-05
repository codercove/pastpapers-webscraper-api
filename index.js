import axios from "axios";
import cheerio from "cheerio";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

app.get("/:grade/:sub", async (req, res) => {
  const grade = req.params.grade;
  const sub = req.params.sub;
  const filteredSources = await getSources(grade, sub);

  if (filteredSources) {
    res.setHeader("Access-Control-Allow-Origin", "*")
      .status(200)
      .send(filteredSources);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*")
      .status(404)
      .send("The page you requested not found");
  }
});

async function getSources(grade, sub) {
  const filteredSources = [];
  const res = await axios(`https://pastpapers.wiki/grade-${grade}-${sub}/`);
  const html = res.data;
  const $ = cheerio.load(html);

  $("a").each(async function () {
    const unFilteredElement = $(this).attr("href");
    const unFilteredElementText = $(this).text();
    const arr = unFilteredElement.split("-");
    for (const i in arr) {
      if (arr[i] === "paper") {
        const resp = await axios(unFilteredElement);
        const elm = resp.data;
        const $$ = cheerio.load(elm);
        $$(".wpfd_downloadlink").each(function () {
          const unFilteredElementURL = $$(this).attr("href");
          filteredSources.push({
            name: unFilteredElementText,
            url: unFilteredElementURL,
          });
        });
      }
    }
  });

  return filteredSources;
}
