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
            result.map((x)=>{
                let status = determineElectionStatus(x.elec_time, x.duration)
                x = {...x, ...status}    
            })
            res.status(200).send(result);
        })
    })


    router.get('/vote/:eid/:cid', verify(), (req, res) => {
        let sql2 = `SELECT vote_time FROM ${table1} WHERE username = ? AND eid = ?`;
        let sql = `UPDATE ${table2} SET vote_count = vote_count + 1 WHERE username = ? AND eid = ?`;
        let sql3 = `SELECT elec_time, duration FROM ${table3} WHERE eid = ?`;
        let sql4 = `UPDATE ${table1} SET vote_time = ? WHERE username = ? AND eid = ?`;
        let voteTime;
        useQuery(db, sql3, [req.params.eid])
        .then((result)=>{
            if(result.length === 0 && result.length > 1) res.status(500).send("Error");
            let status = determineElectionStatus(result[0].elec_time, result[0].duration);
            if(status.status_code === 0) res.status(500).send(status);
            if(status.status_code === 2) res.status(500).send(status);
            useQuery(db,sql2,[req.user.username, req.params.eid])    
            .then((result)=>{
                console.log("Voting To a Candidate:", result)
                if(result.length === 0 || result.length > 1) return res.status(500).send("Error");
                if(result[0].vote_time !== null) return res.status(500).send("Vote has already been casted");
                useQuery(db, sql, [req.params.cid, req.params.eid])
                .then((result) => {
                    voteTime = Math.round((new Date()).getTime() / 1000)
                    console.log(result);
                })
                .then(()=>{
                    useQuery(db,sql4,[voteTime, req.user.username, req.params.eid])
                    .then(()=>{
                        return res.status(200).send('Casted Vote Successfully to the Selected Candidate');
                    })
                })
            })
        })
        .catch(e=>{
            console.log(e)
        })
    })
    
    return router;

}

module.exports = createRouter;