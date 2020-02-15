const { Client } = require('pg')
const client = new Client({
  connectionString: process.env.PGCONSTRING
})

const pgRequest = async(queryString, attrs) => {
  await client.connect()

  const res = await client.query(queryString, attrs)
  
  await client.end()
  return res
}

module.exports = { 
  pgRequest
}