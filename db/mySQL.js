const mysql = require('mysql')

const connection = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME
})

connection.connect()

connection.query('SELECT 1 + 1 AS solution',(err,rows,fields)=>{
    if (err) throw err
    console.log('Connected to database')
})

module.exports = connection