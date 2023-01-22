import Axios from "axios";
import { load } from "cheerio";
import Express from "express";
import { sources } from "./config/sources.js";
import { config } from "dotenv";

config();
const app = Express();
const PORT = process.env.PORT || 8000;
const filteredSources = [[], []];


app.listen(PORT || 8000, console.log(`Server is running on PORT ${PORT}`));

const start = (grade, n) => {
  Axios(sources.pastpaperwiki[grade].main).then((res) => {
    const html = res.data;
    const $ = load(html);
    $("a").each(function () {
      let unFilteredElement = $(this).attr("href");
      let unFilteredElementText = $(this).text();
      for (let i in sources.pastpaperwiki[grade].filters) {
        if (
          unFilteredElement.startsWith(sources.pastpaperwiki[grade].filters[i])
        ) {
          Axios(unFilteredElement).then((resp) => {
            const elm = resp.data;
            const $$ = load(elm);
            $$(".wpfd_downloadlink").each(function () {
              let unFilteredElementURL = $$(this).attr("href");
              filteredSources[n].push({
                name: unFilteredElementText,
                url: unFilteredElementURL,
              });
            });
          });
        }
      }
    });
  });
};

start(10, 0);
start(11, 1);
setTimeout(() => {
  app.get("/", (req, res) => {
    res.send(filteredSources);
  });
}, 2000);
