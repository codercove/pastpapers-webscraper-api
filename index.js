import Axios from "axios";
import { load } from "cheerio";
import Express from "express";
import { config } from "dotenv";

config();
const app = Express();
const PORT = process.env.PORT || 8000;
let filteredSources = [];


app.listen(PORT || 8000, console.log(`Server is running on PORT ${PORT}`));

const start = (grade, sub) => {
  filteredSources = []
  Axios(`https://pastpapers.wiki/grade-${grade}-${sub}/`).then((res) => {
    const html = res.data;
    const $ = load(html);
    $("a").each(function () {
      let unFilteredElement = $(this).attr("href");
      let unFilteredElementText = $(this).text();
        const arr = unFilteredElement.split('-')
        for(let i in arr){
          if(arr[i]=="paper"){
            Axios(unFilteredElement).then((resp) => {
              const elm = resp.data;
              const $$ = load(elm);
              $$(".wpfd_downloadlink").each(function () {
                let unFilteredElementURL = $$(this).attr("href");
                filteredSources.push({
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


  app.get("/:grade/:sub", (req, res) => {
    start(req.params.grade,req.params.sub);
    setTimeout(() => {
    res
      .setHeader("Access-Control-Allow-Origin", "*")
      .status(201)
      .send(filteredSources);
  }, 2000);

  });
