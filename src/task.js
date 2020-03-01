const { megaplan, megaplan_v3 } = require('./megaplan')
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

const getAllTasksV3 = async() => {
  let resultSetLength = 1
  let tasks = []
  let pageAfterId = 0
  while (resultSetLength > 0) {
    const { data } = await megaplan_v3(
      'GET',
      '/api/v3/task?{"fields":["parent"],"filter":{"id":352},"limit":100' + (pageAfterId ? `,"pageAfter":{"id":"${pageAfterId}","contentType":"Task"}` : '') + '}'
    )
    if (!data.length) return tasks
    tasks = [...tasks, ...data]
    pageAfterId = data[data.length - 1].id
    console.log('pageAfterId > ', pageAfterId)
  }
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
    console.log(id, status.name, 'res.rowCount > ', res.rowCount)
  }
  if (['delayed', 'cancelled', 'expired', 'done', 'completed'].includes(status.name)) {
    const res = await pgRequest('UPDATE tasklog SET "to" = $2 WHERE id = $1 AND "to" IS NULL', [id, status.changeTime])
    console.log(id, status.name, 'res.rowCount > ', res.rowCount)
  }
  return null
}

module.exports = { 
  getAllTasks,
  getAllTasksV3,
  getOneTask,
  trackTask
}