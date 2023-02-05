import axios from 'axios'
import cheerio from 'cheerio'
import dotenv from 'dotenv'
import express from 'express'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000

const getSources = async (grade, subject) => {
  const filteredSources = []
  const res = await axios(`https://pastpapers.wiki/grade-${grade}-${subject}/`)
  const html = await res.data
  const $ = cheerio.load(html)

  //Filter All Anchor Elements
  let j = 0;
  $("a").each(async () => {
    const unfilteredElement = $(this).attr('href')
    const unFilteredElementText = $(this).text()
    const splittedArr = unfilteredElement.split('-')

    for (const i in splittedArr) {
      if (splittedArr[i] === "paper") {
        const resp = await axios(unfilteredElement)
        const elm = await resp.data
        const $$ = cheerio.load(elm)

        //filter elemts that have specific class

        $$(".wpfd_downloadlink").each(() => {
          const unFilteredElementURL = $$(this).attr('href')
          filteredSources.push({

            //paper id
            id: j,

            //paper name
            name: unFilteredElementText,

            //paper donwload link
            url: unFilteredElementURL

          })
          j += 1
        })
      }
    }
  })
  return filteredSources
}

//Listening to PORT

app.listen(PORT, () => console.log(`App is listening to PORT : ${PORT}`))

//Sending responses

app.get('/', (req, res) => {
  res
    .status(201)
    .send({
      status: 201,
      error: false,
      message: 'API is Working successfully'
    })
})

app.get('/:grade/:subject', async (req, res) => {
  const grade = req.params.grade
  const subject = req.params.subject

  //Fetch download links of papers 
  const filteredSources = await getSources(grade, subject)

  const responses =  [//{
  //   //Successfull response
  //   status: 200,
  //   error: false,
  //   message: 'no error - data fetched successfully',
  //   items: filteredSources
  // },
  {
    //Unsuccessful response
    status: 404,
    error: true,
    message: 'error - requested data not found',
  }]

  //Check if fetched data empty or not
  if (filteredSources) {
    res
      .setHeader('Access-Control-Allow-Origin', '*')
      .status(201)
      .send(filteredSources)
  } else {
    res
      .setHeader('Access-Control-Allow-Origin', '*')
      .status(404)
      .send(responses[1])
  }

})
