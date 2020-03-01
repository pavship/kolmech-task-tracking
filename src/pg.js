const { Pool } = require('pg')
const pool = new Pool({
  connectionString: process.env.PGCONSTRING
})

const pgRequest = async(queryString, attrs) => {
  return pool.query(queryString, attrs)
}

module.exports = { 
  pgRequest
}