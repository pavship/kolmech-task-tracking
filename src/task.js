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
  const results = await megaplan_v3(
    'GET',
    '/api/v3/task?{"fields":["parent"],"filter":{"id":352}}'
  )
  // const results = await Promise.all([0, 100, 200, 300, 400, 500, 600, 700].map(offset =>
  //   megaplan(
  //       'GET',
  //       '/api/v3/task?{"fields":["parent"],"filter":{"id":352}}'
  //     )
  // ))
  // const tasks = results.reduce((tasks, res) => [...tasks, ...res.data.tasks], [])
  return results.data
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