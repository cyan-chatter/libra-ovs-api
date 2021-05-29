const express = require('express');
const useQuery = require('../useQuery')
const verify = require('../verify');

var createRouter = (db) => {
    var router = express.Router();    
    
    router.get('/conductor', verify(), (req,res) =>{
        let sql = 'SELECT * FROM election_records WHERE cond_id = ?'
        useQuery(db,sql,[req.user.username])
        .then((result)=>{
            res.status(200).send(result);
        })
    })
    
    router.post('/conduct/:method/:orgId', verify(), (req, res) => {
        
        let sql1 = 'SELECT username FROM users WHERE org_id = ? AND username != ?'   
        let sql2 = 'SELECT username FROM users WHERE username = ?'
        let sql3 = 'INSERT INTO election_records SET ?'

        let sql4 = 'INSERT INTO candidates (username, eid, vote_count) VALUES '
        let sql5 = 'INSERT INTO voters (username, eid) VALUES '
        
        let voters=[],org,x;
        let unixTime = Math.round((new Date()).getTime() / 1000)
        let eid = unixTime.toString() + req.user.username
        let eData = {
            eid,
            cond_id : req.user.username,
            elec_time : parseInt(req.body.start_time),
            duration : parseInt(req.body.duration),
            post : req.body.post
        }
        if(req.params.method !== "org" && req.params.method !== "manual") return res.status(400).send("Error: Need to Specify a Method")
        if(req.body.candidates === null || req.body.candidates.length < 2){
            return res.status(400).send("Enter atleast two candidates")
        }
        if(req.params.method === "org" && req.params.orgId === null) return res.status(400).send("Error")
        
        if(req.params.method === "manual"){
            org = "NULL" 
            if(req.body.voters === null || req.body.voters.length === 0) return res.status(500).send("Enter Atleast a single Voter")
        } 
        else org = req.params.orgId
        if(eData.elec_time <= unixTime) return res.status(400).send("Error: The Specified Time Has Already Passed")
        useQuery(db, sql1, [org, req.user.username])
        .then((result1)=>{
            console.log("Query 1: ", result1)
            if(req.params.method === "manual"){
                voters = req.body.voters
            }
            else{
                if(result1.length === 0) return res.status(500).send("There is no one in your Organization")
                result1.map((x)=>{
                    voters.push(x.username)
                })
            }
        })
        //sql 2 check for all users ----pending----
        .then(()=>{
            useQuery(db,sql3,eData)
            .then((result)=>{
                console.log(result)
                let str='';
                req.body.candidates.map((x,i) => {
                    str += `('${x}', '${eid}', 0)`
                    if(i !== req.body.candidates.length - 1) str += `, `
                })
                sql4 += str
                let str2='';
                voters.map((x,i)=>{
                    str2 += `('${x}', '${eid}')`
                    if(i !== voters.length - 1) str2 += `, `
                })
                sql5 += str2
                console.log("SQL Candidates :", sql4)
                console.log("SQL Voters : ", sql5)

                useQuery(db,sql4)
                .then((result2)=>{
                    console.log(result2)
                    useQuery(db,sql5)
                    .then((result3)=>{
                        console.log(result3)
                        let resp = {
                            ...eData,
                            candidates : req.body.candidates,
                            voters,
                            message : "Election Scheduled Successfully"
                        }
                        res.status(200).send(resp)
                    })
                })
            })
        })
    })
    
    return router;
}

module.exports = createRouter;