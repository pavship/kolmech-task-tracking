const { megaplan } = require('./megaplan')
const { pgRequest } = require('./pg')

const getAllTasks = async() => {
  const results = await Promise.all([0, 100, 200, 300, 400, 500, 600, 700].map(offset =>
    megaplan(
        'GET',
        '/BumsTaskApiV01/Task/list.api?Limit=100&RequestedFields=[Id,Name]&Offset=' + offset
      )
  ))
  const tasks = results.reduce((tasks, res) => [...tasks, ...res.data.tasks], [])
  return tasks
}

const getOneTask = async() => {
  const task = await megaplan(
    'GET',
    '/BumsTaskApiV01/Task/card.api?Id=1000042&RequestedFields=[Id,Name]'
  )
  return [task]
}

const trackTask = async(id, status) => {
  if (status.name === 'accepted') {
    const res = await pgRequest('INSERT INTO tasklog VALUES ($1, $2)', [id, status.changeTime])
    console.log(id, status.name, 'res.rows[0] > ', res.rows[0])
  }
  if (['delayed', 'cancelled', 'expired', 'done', 'completed'].includes(status.name))
    console.log('task stopped')
  return null
}

module.exports = { 
  getAllTasks,
  getOneTask,
  trackTask
}