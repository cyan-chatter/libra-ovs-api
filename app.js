const express = require('express')
const path = require('path')

let db = require('./dbConnect')

const verify = require('./verify')

const entry = require('./routers/entry')
const conduct = require('./routers/conduct')
const candidate = require('./routers/candidate')
const voter = require('./routers/voter')

const port = process.env.PORT||3000

const app = express()

app.use(express.json())

const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

//Using the Routes Here
//----------------

app.use(entry(db))
app.use(conduct(db))
app.use(voter(db))
app.use(candidate(db))

//----------------

app.get('/', (_, res) => {
    res.send("Welcome to Libra - an API for Online Voting")
})

let table1 = 'election_records';
let table2 = 'users';
let table3 = 'voters';
let table4 = 'candidates';
let table5 = 'user_tokens';


//Run Script Once
//----------------------------------------------------------------------------------------


let sql1 = `CREATE TABLE ${table1} (eid VARCHAR(255) PRIMARY KEY, cond_id VARCHAR(255) FOREIGN KEY REFERENCES election_records(eid), elec_time int(11) NOT NULL, duration int NOT NULL, post VARCHAR(60))`;
let sql2 = `CREATE TABLE ${table2} (username VARCHAR(255) UNIQUE NOT NULL, name VARCHAR(60) NOT NULL, email VARCHAR(60) UNIQUE NOT NULL, age int, password VARCHAR(255) NOT NULL, org_id VARCHAR(60) NOT NULL, PRIMARY KEY(username)`;
let sql3 = `CREATE TABLE ${table3} (username VARCHAR(255) FOREIGN KEY REFERENCES users(username), eid VARCHAR(255) FOREIGN KEY REFERENCES election_records(eid), vote_time int(11), PRIMARY KEY(username, eid))`; 
let sql4 = `CREATE TABLE ${table4} (username VARCHAR(255) FOREIGN KEY REFERENCES users(username), eid VARCHAR(255) FOREIGN KEY REFERENCES election_records(eid), name VARCHAR(60), vote_count int, PRIMARY KEY(username, eid))`; 
let sql5 = `CREATE TABLE ${table5} (username VARCHAR(255) FOREIGN KEY REFERENCES users(username), token VARCHAR(255) NOT NULL, PRIMARY KEY(username, token))`

app.get('/createtable1', (req, res) => {
    
    db.query(sql1, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Table Created');
    });
});

app.get('/createtable2', (req, res) => {
    
    db.query(sql2, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Table Created');
    });
});

app.get('/createtable3', (req, res) => {
    
    db.query(sql3, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Table Created');
    });
});

app.get('/createtable4', (req, res) => {
    
    db.query(sql4, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Table Created');
    });
});

app.get('/createtable5', (req, res) => {
    
    db.query(sql5, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Table Created');
    });
});


//----------------------------------------------------------------------------------------



app.get('/election/:eid', verify(), async (req,res)=>{
    let sql = `SELECT * FROM ${table1}`
    useQuery(db, sql, [req.params.eid])
    .then(()=>{
        res.status(200).send(result)
    })
    .catch((err)=>{
        console.log(err)
        res.status(500).send("Unable to Resolve the Request")
    })
})

app.get('/results/:eid', verify(), async (req,res)=>{
    let sql = `SELECT elec_status FROM ${table1} WHERE eid = ?`
    useQuery(db, sql, [req.params.eid])
    .then(()=>{
        if(result[0].elec_status === 0) res.status(500).send("Voting has not started yet")
        else if(result[0].elec_status === 1) res.status(500).send("Voting is currently going on")
        let sql2 = `
            SELECT a.username, a.vote_count 
            FROM ${table4} a
            INNER JOIN (
                SELECT username, MAX(vote_count) vote_count 
                FROM ${table4}
                GROUP BY username
            ) b ON a.username = b.username AND a.vote_count = b.vote_count
        `
        useQuery(db,sql2)
        .then((result2)=>{
            if(result2.length < 0){
                res.status(500).send("No Voters")    
            }
            res.status(200).send(result2)
        })
    })
    .catch((err)=>{
        console.log(err)
        res.status(500).send("Unable to Resolve the Request")
    })
})



app.get('*',(_,res)=>{
    res.status(404).send("The Requested Operation is Not Found")
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})


