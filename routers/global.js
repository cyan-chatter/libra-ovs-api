const express = require('express');
const useQuery = require('../useQuery');
const verify = require('../verify');
const determineElectionStatus = require('../elecStatus')

var createRouter = (db) => {
    var router = express.Router();
    
    router.get('/elections', verify(), async (req,res)=>{
        let sql = 'SELECT * FROM election_records'
        useQuery(db, sql)
        .then((result)=>{
            if(result.length === 0) return res.status(200).send([])
            result.map((x)=>{
                let status = determineElectionStatus(x.elec_time, x.duration)
                x = {...x, ...status}
            })
            res.status(200).send(result)
        })
        .catch((err)=>{
            console.log(err)
            res.status(500).send("Unable to Resolve the Request")
        })
    })

    router.get('/elections/:eid', verify(), async (req,res)=>{
        let sql = 'SELECT * FROM election_records WHERE eid = ?'
        useQuery(db, sql, [req.params.eid])
        .then((result)=>{
            console.log("Election of an E ID: ", result)
            if(result.length === 0) return res.status(500).send("No Election with This Election ID")
            if(result.length > 1) return res.status(500).send("Unable to Resolve the Request")
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
        .then((result)=>{
            if(result.length === 0) return res.status(500).send("No Election with This Election ID")
            if(result.length > 1) return  res.status(500).send("Unable to Resolve the Request")
            let status = determineElectionStatus(result[0].elec_time, result[0].duration)
            if(status.status_code === 0) return  res.status(500).send(status)
            
            let sql2 = `SELECT username, vote_count FROM candidates WHERE eid = ? AND vote_count = (SELECT MAX(vote_count) FROM candidates)`

            useQuery(db,sql2,[req.params.eid])
            .then((result2)=>{
                if(result2.length < 0){
                    res.status(500).send("No Voters in the Election")    
                }
                let resp = {
                    ...status,
                    ...result2
                }
                res.status(200).send(resp)
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