const test = async() {
    const { Client } = require('pg')
    console.log('process.env.PGCONSTRING > ', process.env.PGCONSTRING)
    const client = new Client({
      connectionString: process.env.PGCONSTRING
    })
    
    await client.connect()
    const res = await client.query('SELECT $1::text as message', ['Hello world!'])
    console.log(res.rows[0].message) // Hello world!
    await client.end()
}

test()