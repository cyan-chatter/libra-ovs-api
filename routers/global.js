const express = require('express');
const useQuery = require('../useQuery');
const verify = require('../verify');
const determineElectionStatus = require('../elecStatus')

var createRouter = (db) => {
    var router = express.Router();
    
    router.get('/election/:eid', verify(), async (req,res)=>{
        let sql = 'SELECT * FROM election_records'
        useQuery(db, sql, [req.params.eid])
        .then(()=>{
            if(result.length === 0) res.status(500).send("No Election with This Election ID")
            if(result.length > 1) res.status(500).send("Unable to Resolve the Request")
            let status,resp
            status = determineElectionStatus(result[0].elec_time, result[0].duration)
            resp = {...result, ...status}
            res.status(200).send(resp)
        })
        .catch((err)=>{
            console.log(err)
            res.status(500).send("Unable to Resolve the Request")
        })
    })
    
    router.get('/results/:eid', verify(), async (req,res)=>{
        let sql = 'SELECT elec_time, duration FROM election_records WHERE eid = ?'
        useQuery(db, sql, [req.params.eid])
        .then(()=>{
            if(result.length === 0) res.status(500).send("No Election with This Election ID")
            if(result.length > 1) res.status(500).send("Unable to Resolve the Request")
            let status = determineElectionStatus(result[0].elec_time, result[0].duration)
            if(status.status_code === 0) res.status(500).send("Voting has not started yet")
            else if(status.status_code === 1) res.status(500).send("Voting is currently going on")
            let sql2 = `
                SELECT a.username, a.vote_count 
                FROM candidates a
                INNER JOIN (
                    SELECT username, MAX(vote_count) vote_count 
                    FROM candidates
                    GROUP BY username
                ) b ON a.username = b.username AND a.vote_count = b.vote_count
            `
            useQuery(db,sql2)
            .then((result2)=>{
                if(result2.length < 0){
                    res.status(500).send("No Voters in the Election")    
                }
                res.status(200).send(result2)
            })
        })
        .catch((err)=>{
            console.log(err)
            res.status(500).send("Unable to Resolve the Request")
        })
    })
    

    return router;
}

module.exports = createRouter;