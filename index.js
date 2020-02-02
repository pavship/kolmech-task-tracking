const express = require('express')
const app = express()
require('dotenv').config()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const { getAllTasks } = require('./src/task')


app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.get('/tasks', async(req, res) => {
  // TODO log client ip
  console.log('-> incoming request /tasks ip: ', req.headers['x-forwarded-for'] || req.connection.remoteAddress)
  try {
    const tasks = await getAllTasks()
    res.send({ tasks })
  } catch (err) {
    res.status(500).send({
      message: 'Kolmech server error!'
    })
    console.log('/tasks error > ', err)
  }
})

const port = process.env.PORT || 8000
app.listen(port, () => {
	console.log(`Listening on port ${port}!...`)
})





