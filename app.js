const express = require('express')
const path = require('path')

let db = require('./dbConnect')

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

//Run Script Once
//----------------------------------------------------------------------------------------

let table1 = 'election_records';
let table2 = 'users';
let table3 = 'voters';
let table4 = 'candidates';
let table5 = 'user_tokens';

let sql1 = `CREATE TABLE ${table1} (eid varchar(255) UNIQUE NOT NULL, cond_id varchar(255) NOT NULL, when varchar(60) NOT NULL, duration int NOT NULL, post varchar(60), elec_status int NOT NULL, PRIMARY KEY(eid))`;
let sql2 = `CREATE TABLE ${table2} (username varchar(255) UNIQUE NOT NULL, name varchar(60) NOT NULL, email varchar(60) UNIQUE NOT NULL, age int, password varchar(255) NOT NULL, org_id varchar(60) NOT NULL, PRIMARY KEY(username)`;
let sql3 = `CREATE TABLE ${table3} (username varchar(255) NOT NULL, eid varchar(255) NOT NULL, vote_time varchar(60), PRIMARY KEY(username, eid))`; //make f key
let sql4 = `CREATE TABLE ${table4} (username varchar(255) NOT NULL, eid varchar(255) NOT NULL, name varchar(60), vote_count int, PRIMARY KEY(username, eid))`; // make f key
let sql5 = `CREATE TABLE ${table5} (username varchar(255) NOT NULL, token varchar(255) NOT NULL, PRIMARY KEY(username, token))` // make f key

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



app.get('*',(_,res)=>{
    res.status(404).send("The Requested Operation is Not Found")
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})


