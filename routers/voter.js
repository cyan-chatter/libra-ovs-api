const db = require('../dbConnect');
const express = require('express');
const useQuery = require('../useQuery');
const verify = require('../verify');

var createRouter = (db) => {
    var router = express.Router();

    let table1 = 'voters';
    let table2 = 'candidates';
    let table3 = 'election_records';

    router.get('/voter', verify(), (req, res) => {
        let sql = `SELECT eid FROM ${table1} WHERE username = ?`;
        useQuery(db, sql, [req.user.username])
        .then((result) => {
            console.log(result);
            res.status(200).send(result);
        })
    })

    router.get('/voter/:eid', verify(), (req, res) => {
        let sql = `SELECT elec_status FROM ${table3} WHERE eid = ?`;
        let sql2 = `SELECT name, username FROM ${table2} WHERE eid = ?`;
        let status; 
        useQuery(db, sql, [req.params.eid])
        .then((result)=>{
            if(result.length === 0 && result.length > 1) res.status(500).send("Error");
            status = result[0].elec_status
            useQuery(db, sql2, [req.params.eid])
            .then((candidates) => {
                console.log(candidates);
                let resp = {
                    elec_status : status,
                    candidates
                }
                res.status(200).send(resp);
            })
        })
    })

    router.get('/voter/:eid/:cid', verify(), (req, res) => {
        let sql2 = `SELECT vote_time FROM ${table1} WHERE username = ? AND eid = ?`;
        let sql = `UPDATE ${table2} SET vote_count = vote_count + 1 WHERE username = ? AND eid = ?`;
        let sql3 = `SELECT elec_status FROM ${table3} WHERE eid = ?`;
        useQuery(db, sql3, [req.params.eid])
        .then((result)=>{
            if(result.length === 0 && result.length > 1) res.status(500).send("Error");
            if(result[0].elec_status === 0) res.status(500).send("Voting has not been Commenced yet");
            if(result[0].elec_status === 2) res.status(500).send("Voting Session has already Ended");
            useQuery(db,sql2,[req.user.username, req.params.eid])    
            .then((result)=>{
                //check
                if(result.length > 0) return res.status(500).send("Vote has already been casted");
                useQuery(db, sql, [req.params.cid, req.params.eid])
                .then((result) => {
                    console.log(result);
                    res.status(200).send('Incremented vote count for candidate...');
                })
            })
        })
    })
    
    return router;

}

module.exports = createRouter;