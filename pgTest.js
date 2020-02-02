const test = async() => {
    const { Client } = require('pg')
    const client = new Client({
      connectionString: process.env.PGCONSTRING
    })
    
    await client.connect()
    
    // const res = await client.query('SELECT $1::text as message', ['Hello world!'])
    // console.log(res.rows[0].message) // Hello world!
    
    // const res = await client.query('SELECT * FROM tasklog')
    // console.log(res.rows[0])

    const res = await client.query('INSERT INTO tasklog VALUES (123, $1)', [new Date()])
    console.log(res.rows[0])

    await client.end()
}

test()
