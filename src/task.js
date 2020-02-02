const { megaplan } = require('./megaplan')

const getAllTasks = async() => {
  const results = await Promise.all([0, 100, 200, 300, 400, 500, 600, 700].map(offset =>
    megaplan(
        'GET',
        '/BumsTaskApiV01/Task/list.api?Limit=100&Offset=' + offset
      )
  ))
  const tasks = results.reduce((tasks, res) => [...tasks, ...res.data.tasks], [])
  return tasks
}

module.exports = { 
  getAllTasks
}