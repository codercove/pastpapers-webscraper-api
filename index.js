import axios from "axios";
import { load } from "cheerio";
import express from "express";
import { config } from "dotenv";

config();
const app = express();
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));

const start = async (grade, subject) => {
  let id = 0
  let filteredSources = [];
  try {

    const res = await axios.get(`https://pastpapers.wiki/grade-${grade}-${subject}/`);
    const html = res.data;
    const $ = load(html);

    $("a").each(async function () {

      const unFilteredElement = $(this).attr("href");
      const unFilteredElementText = $(this).text();
      const arr = unFilteredElement.split("-");

      for (const i in arr) {
        if (arr[i] === "paper") {
          try {

            const resp = await axios.get(unFilteredElement);
            const elm = resp.data;
            const $$ = load(elm);

            //search for anchor tags which have specific class

            $$(".wpfd_downloadlink").each(function () {

              const unFilteredElementURL = $$(this).attr("href");

              //Insert fetched data to an Array

              filteredSources.push({
                id: id,
                name: unFilteredElementText,
                url: unFilteredElementURL
              });

              j++

            });

          } catch (error) {

            console.error(error);

          }
        }
      }
    });

  } catch (error) {

    console.error(error);

  }
  finally {
    filteredSources == [] ? null : filteredSources;
  }
};

//Send response on client request

app.get("/:grade/:subject", async (req, res) => {
  const sources = await start(req.params.grade, req.params.subject);

  setTimeout(() => {
    if (sources) {
      console.log(sources)
      const response = {
        status: 200,
        error: false,
        message: 'successfull',
        items: sources
      }
      res
        .set("Access-Control-Allow-Origin", "*")
        .status(201)
        .send(response);
    }
    else {
      res
        .set("Access-Control-Allow-Origin", "*")
        .status(404)
        .send({
          status: 404,
          error: true,
          message: 'requested data not found',
        });
    }
  }, 2000);
})
