const db = require('../dbConnect');
const express = require('express');
const useQuery = require('../useQuery');
const verify = require('../verify');

const table = 'candidates';
const table2 = 'election_records';

var createRouter = (db) => {
    var router = express.Router();
    router.get('/candidate', verify(), (req, res) => {
        let sql = `SELECT eid FROM ${table} WHERE username = ?`;
        useQuery(db, sql, [req.user.username])
        .then((result) => {
            console.log(result);
            res.send(result);
        })
    })
    router.get('/candidate/withdraw/:eid', verify(), (req,res) => {
        let sql = `SELECT elec_status FROM ${table2} WHERE eid = ?`;
        let sql2 = `DELETE FROM ${table} WHERE username = ? AND eid = ?`; //check
        useQuery(db,sql,[req.params.eid])
        .then((result)=>{
            if(result.length === 0) return res.status(400).send("No election with this Election ID")
            if(result.length > 1) return res.status(500).send("Error")
            if(result[0].elec_status === 1) return res.status(400).send("Cannot Withdraw Now as Election Has been Started")
            if(result[0].elec_status === 2) return res.status(400).send("Election Has Ended")
            else if(result[0].elec_status === 0){
                useQuery(db,sql2,[req.user.username, req.params.eid])
                .then((result2)=>{
                    if(result2.length === 0) return res.status(400).send("You are not a Candidate in this election")
                    res.status(200).send({
                        withdrew : result,
                        message : "Withdraw Successful"
                    })
                })
            }            
        })
    })
    
    return router;
}

module.exports = createRouter;