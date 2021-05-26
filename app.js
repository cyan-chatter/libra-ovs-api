const express = require('express')
const path = require('path')

let db = require('./dbConnect')

const entry = require('./routers/entry')

const port = process.env.PORT||3000

const app = express()

app.use(express.json())

const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

//Using the Routes Here
//----------------


app.use(entry(db))
//----------------

app.get('/', (_, res) => {
    res.send("Welcome to Libra - an API for Online Voting")
})

//Run Script Once
//----------------------------------------------------------------------------------------
// Create DB - uncomment only when required to create a new database for testing/debugging --request only once with dbname and comment again
// When Creating DB, Remember to Comment out the dbname param in db.createConnection in dbConnect file

// const dbname = 'libradevdb' // set dbname
// app.get('/createdb', (_, res) => {
//     let sql = `CREATE DATABASE ${dbname}`;
//     db.query(sql, (err, result) => {
//         if(err) throw err;
//         console.log(result);
//         res.send('Database created');
//     });
// });

// // Create table
app.get('/createuserstable', (req, res) => {
    let sql = 'CREATE TABLE users(id int UNIQUE NOT_NULL AUTO_INCREMENT, username VARCHAR(255) UNIQUE NOT_NULL, name VARCHAR(255), email VARCHAR(255), age int, password VARCHAR(255), PRIMARY KEY(username))';
    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Posts table created');
    });
});




















//----------------------------------------------------------------------------------------

app.get('*',(_,res)=>{
    res.status(404).send("The Requested Operation is Not Found")
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})


