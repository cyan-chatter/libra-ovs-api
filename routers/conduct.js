const db = require('../dbConnect');
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
        
        let sql1 = 'SELECT username FROM users WHERE org_id = ? AND username != '   
        let sql2 = 'SELECT username FROM users WHERE username = ?'
        let sql3 = `INSERT INTO election_records SET ?`;
        let sql4 = 'INSERT INTO candidates SET ?';
        let sql5 = 'INSERT INTO voters SET ?';
        
        //eid , cond_id, when, duration, post, elec_status
        let voters;
        let eData = {
            eid : '',
            cond_id : req.user.username,
            when : req.body.time,
            duration : req.body.duration,
            post : req.body.post,
            elec_status : 0,
        }
        if(req.body.candidates === null || req.body.candidates.length < 2){
            return res.status(400).send("Enter atleast two candidates")
        }
        if(req.params.method !== "org" && req.params.method !== "manual") return res.status(400).send("Error")
        else if(req.params.method === "org" && req.params.orgId === null) return res.status(400).send("Error")
        
        useQuery(db, sql1, [req.params.orgId, req.user.username])
        .then((result)=>{
            console.log(result)
            if(req.params.method === "manual"){
                voters = req.body.voters
                if(voters.length === 0) return res.status(500).send("Enter Atleast a single Voter")
            }
            else{
                if(result.length === 0) return res.status(500).send("There is no one in your Organization")
                result.map((x)=>{
                    voters.push(x.username)
                })
            }
        })
        //sql 2 check for all users ----pending----
        .then(()=>{
            useQuery(db,sql3,eData)
            .then((result)=>{
                console.log(result)
                useQuery(db,sql4,req.body.candidates)
                .then((result2)=>{
                    console.log(result2)
                    useQuery(db,sql5,voters)
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