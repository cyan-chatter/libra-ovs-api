const express = require('express');

//Run Script Once
var createRouter = (db) => {
    
    var router = express.Router();
    
    let table1 = 'users';
    let table2 = 'election_records';
    let table3 = 'voters';
    let table4 = 'candidates';
    let table5 = 'user_tokens';


    let sql1 = `CREATE TABLE ${table1} (username VARCHAR(255) UNIQUE NOT NULL, name VARCHAR(60) NOT NULL, email VARCHAR(60) UNIQUE NOT NULL, age int, password VARCHAR(255) NOT NULL, org_id VARCHAR(60) NOT NULL, PRIMARY KEY(username))`;

    let sql2 = `CREATE TABLE ${table2} (eid VARCHAR(255) PRIMARY KEY, cond_id VARCHAR(255), elec_time int(11) NOT NULL, duration int NOT NULL, post VARCHAR(60), FOREIGN KEY(cond_id) REFERENCES users(username))`;

    let sql3 = `CREATE TABLE ${table3} (username VARCHAR(255), eid VARCHAR(255), vote_time int(11), FOREIGN KEY(username) REFERENCES users(username), FOREIGN KEY(eid) REFERENCES election_records(eid), PRIMARY KEY(username, eid))`; 

    let sql4 = `CREATE TABLE ${table4} (username VARCHAR(255), eid VARCHAR(255), name VARCHAR(60), vote_count int, FOREIGN KEY(username) REFERENCES users(username), FOREIGN KEY(eid) REFERENCES election_records(eid), PRIMARY KEY(username, eid))`; 

    let sql5 = `CREATE TABLE ${table5} (username VARCHAR(255), token VARCHAR(255) NOT NULL, FOREIGN KEY(username) REFERENCES users(username), PRIMARY KEY(username, token))`

    router.get('/createtable1', (req, res) => {
        
        db.query(sql1, (err, result) => {
            if(err) throw err;
            console.log(result);
            res.send('Table Created');
        });
    });

    router.get('/createtable2', (req, res) => {
        
        db.query(sql2, (err, result) => {
            if(err) throw err;
            console.log(result);
            res.send('Table Created');
        });
    });

    router.get('/createtable3', (req, res) => {
        
        db.query(sql3, (err, result) => {
            if(err) throw err;
            console.log(result);
            res.send('Table Created');
        });
    });

    router.get('/createtable4', (req, res) => {
        
        db.query(sql4, (err, result) => {
            if(err) throw err;
            console.log(result);
            res.send('Table Created');
        });
    });

    router.get('/createtable5', (req, res) => {
        
        db.query(sql5, (err, result) => {
            if(err) throw err;
            console.log(result);
            res.send('Table Created');
        });
    });
    
    return router;
}

module.exports = createRouter;