const mysql = require('mysql')

const connection = mysql.createConnection({
    host:"demodb.grammarschooluk.co.uk",
    user:"dbu1178930",
    password:"dbPW$998536$d3m0",
    database:"aaron"
})

connection.connect()

connection.query('SELECT 1 + 1 AS solution',(err,rows,fields)=>{
    if(err) throw err
    console.log('Connected to database')
})

module.exports = connection