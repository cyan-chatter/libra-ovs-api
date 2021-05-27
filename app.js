const express = require('express')
const path = require('path')

let db = require('./dbConnect')

const entry = require('./routers/entry')
const voter = require('./routers/voter')
const useQuery = require('./useQuery')

const port = process.env.PORT||3000

const app = express()

app.use(express.json())

const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

//Using the Routes Here
//----------------
app.use(entry(db))

//app.use(voter(db))


//----------------

app.get('/', (_, res) => {
    res.send("Welcome to Libra - an API for Online Voting")
})

app.get('/electiondetails/:electionid', verify(), async (req,res)=>{
    let tableName = `voting${req.params.electionId}`
    let sql = `SELECT * FROM ${tableName}`
    useQuery(db, sql, [req.params.electionId])
    .then(()=>{
        res.status(200).send(result)
    })
    .catch((err)=>{
        console.log(err)
        res.status(500).send("Unable to Resolve the Request")
    })
})

app.get('/electionresult/:electionid', verify(), async (req,res)=>{
    let tableName = `voting${req.params.electionId}`
    let sql = `SELECT votingStatus FROM ${tableName} WHERE electionId = ?`
    useQuery(db, sql, [req.params.electionId])
    .then(()=>{
        if(result[0].votingStatus === 0) res.status(500).send("Voting has not started yet")
        else if(result[0].votingStatus === 1) res.status(500).send("Voting is currently going on")
        let sql2 = `
            SELECT a.cid, a.voteCount 
            FROM ${tableName} a
            INNER JOIN (
                SELECT cid, MAX(voteCount) voteCount
                FROM ${tableName}
                GROUP BY cid
            ) b ON a.cid = b.cid AND a.voteCount = b.voteCount 
        `
        useQuery(db,sql2)
    })
    .then((result)=>{
        if(result.length < 0){
            res.status(500).send("No Voters")    
        }
        res.status(200).send(result)
    })
    .catch((err)=>{
        console.log(err)
        res.status(500).send("Unable to Resolve the Request")
    })
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
// app.get('/createuserstable', (req, res) => {
//     let sql = 'CREATE TABLE users(username VARCHAR(255) UNIQUE NOT NULL, name VARCHAR(255), email VARCHAR(255) UNIQUE NOT NULL, age int, password VARCHAR(255), PRIMARY KEY(username))';
//     db.query(sql, (err, result) => {
//         if(err) throw err;
//         console.log(result);
//         res.send('Users Table Created');
//     });
// });




















//----------------------------------------------------------------------------------------

app.get('*',(_,res)=>{
    res.status(404).send("The Requested Operation is Not Found")
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})


