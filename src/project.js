const { megaplan } = require('./megaplan')

const getAllProjects = async() => {
  const results = await Promise.all([0, 100, 200, 300, 400, 500, 600, 700].map(offset =>
    megaplan(
       'GET',
       '/BumsProjectApiV01/Project/list.api?Limit=100&Offset=' + offset
     )
  ))
  const projects = results.reduce((projects, res) => [...projects, ...res.data.projects], [])
  return projects
}

module.exports = { 
  getAllProjects
}