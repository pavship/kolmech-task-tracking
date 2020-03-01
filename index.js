const express = require('express')
const basicAuth = require('express-basic-auth')
const app = express()
require('dotenv').config()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const { getAllTasks, getAllTasksV3, getOneTask, trackTask } = require('./src/task')

app.use((req, res, next) => {
  //console.log('req.headers > ', Object.keys(req.headers))
  // console.log('req.query > ', Object.keys(req.query))
  console.log('req.headers.authorization > ', req.headers.authorization)
  // if (!req.headers.authorization) {
  //   return res.status(403).json({ error: 'No credentials sent!' });
  // }
  next()
})

app.post('/megaplan', async (req, res) => {
	try {
		res.status(200).send('Request handled')
		const {
			data,
			model,
			event
		} = req.body
		console.log('/megaplan model, event, data.id > ', model, event, data.id)
		// require('fs').writeFileSync('output.json', JSON.stringify(req.body, null, 2))
		// console.log('/megaplan req.body > ', JSON.stringify(req.body, null, 2))
		status = {
			name: data.status,
			changeTime: data.statusChangeTime.value
		}
    console.log('status > ', status)
    trackTask(data.id, status)
		// const result = await megaplan(
		// 	'GET',
		// 	'/BumsTaskApiV01/Task/card.api?Id=' + data.id
		// )
		// require('fs').writeFileSync('task.json', JSON.stringify(result.data, null, 2))
		// const comments = await megaplan(
		// 	'GET',
		// 	'/BumsCommonApiV01/Comment/list.api?SubjectType=task&SubjectId=' + data.id
		// )
		// require('fs').writeFileSync('comments.json', JSON.stringify(comments.data, null, 2))
		// if (model === 'Project' && ['on_after_create', 'on_after_update', 'on_after_drop'].includes(event)) {
		// 	await upsertMpProjectKolmechRecord(data)
		// }
		
	} catch (err) {
		console.log('app.post(/megaplan) caught err.message > ', err.message)
	}
})

app.use(basicAuth({
  users: { 'admin': 'supersecret' }
}))

app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.get('/tasks', async(req, res) => {
  // TODO log client ip
  console.log('-> incoming request from ip: ', req.headers['x-forwarded-for'] || req.connection.remoteAddress, ' -> /tasks')
  console.log('-> user: ', req.auth.user)
  try {
    const tasks = await getAllTasks()
    // const tasks = await getOneTask()
    res.send({ tasks })
  } catch (err) {
    res.status(500).send({
      message: 'Kolmech server error!'
    })
    console.log('/tasks error > ', err)
  }
})

app.get('/tasksv3', async(req, res) => {
  // TODO log client ip
  console.log('-> incoming request from ip: ', req.headers['x-forwarded-for'] || req.connection.remoteAddress, ' -> /tasksv3')
  console.log('-> user: ', req.auth.user)
  try {
    const tasks = await getAllTasksV3()
    // const tasks = await getOneTask()
    res.send({ tasks })
  } catch (err) {
    res.status(500).send({
      message: 'Kolmech server error!'
    })
    console.log('/tasksv3 error > ', err)
  }
})

const port = process.env.PORT || 8000
app.listen(port, () => {
	console.log(`Listening on port ${port}!...`)
})





