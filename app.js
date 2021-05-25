const express = require('express')
const path = require('path')

let db = require('../dbConnect')

const entry = require('./routers/entry')

const port = process.env.PORT||3000

const app = express()

app.use(express.json())

const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

app.use(entry(db))


app.get('/', (_, res) => {
    res.send("Welcome to Libra - an API for Online Voting")
})

// Create DB - uncomment only when required to create a new database for testing/debugging 
// const sql = require('mysql')
// app.get('/createdb', (req, res) => {
//     let sql = 'CREATE DATABASE dbname';
//     db.query(sql, (err, result) => {
//         if(err) throw err;
//         console.log(result);
//         res.send('Database created');
//     });
// });

app.get('*',(_,res)=>{
    res.status(404).send("The Requested Operation is Not Found")
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})


