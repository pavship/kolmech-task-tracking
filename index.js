const express = require('express')
const app = express()
require('dotenv').config()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const { megaplan } = require('./src/megaplan')

app.get('/tasks', (req, res) => {
  console.log('-> incoming request /tasks ip: ', req.headers['x-forwarded-for'] || req.connection.remoteAddress)
	res.send('Hello World!')
})

const port = process.env.PORT || 8000
app.listen(port, () => {
	console.log(`Listening on port ${port}!...`)
})


