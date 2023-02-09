import express from 'express'
import { config } from 'dotenv'
import bodyParser from 'body-parser'
import router from './controllers/controller.js'

config()

const app = express()
const PORT = process.env.PORT || 8000

app.use(bodyParser.json())
app.use('/',router)

app.listen(PORT,()=>console.log(`App is listening to http://localhost:${PORT}`))



