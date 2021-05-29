const express = require('express');
const useQuery = require('../useQuery');
const verify = require('../verify');
const determineElectionStatus = require('../elecStatus')

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
            const resp = result.map((x)=>{
                let status = determineElectionStatus(x.elec_time, x.duration)
                x = {...x, ...status}    
            })
            res.status(200).send(resp);
        })
    })

    router.get('/voter/:eid', verify(), (req, res) => {
        let sql = `SELECT elec_time, duration FROM ${table3} WHERE eid = ?`;
        let sql2 = `SELECT name, username FROM ${table2} WHERE eid = ?`;
        let start_time, duration, status; 
        useQuery(db, sql, [req.params.eid])
        .then((result)=>{
            if(result.length === 0 && result.length > 1) res.status(500).send("Error");
            start_time = result[0].elec_time
            duration = result[0].duration
            status = determineElectionStatus(start_time,duration)
            useQuery(db, sql2, [req.params.eid])
            .then((candidates) => {
                console.log(candidates);
                let resp = {
                    start_time,
                    duration,
                    ...status,
                    candidates
                }
                res.status(200).send(resp);
            })
        })
    })

    router.get('/voter/:eid/:cid', verify(), (req, res) => {
        let sql2 = `SELECT vote_time FROM ${table1} WHERE username = ? AND eid = ?`;
        let sql = `UPDATE ${table2} SET vote_count = vote_count + 1 WHERE username = ? AND eid = ?`;
        let sql3 = `SELECT elec_time, duration FROM ${table3} WHERE eid = ?`;
        useQuery(db, sql3, [req.params.eid])
        .then((result)=>{
            if(result.length === 0 && result.length > 1) res.status(500).send("Error");
            let status = determineElectionStatus(result[0].elec_time, result[0].duration);
            if(status.status_code === 0) res.status(500).send(status);
            if(status.status_code === 2) res.status(500).send(status);
            useQuery(db,sql2,[req.user.username, req.params.eid])    
            .then((result)=>{
                //check if this works
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