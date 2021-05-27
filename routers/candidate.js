const express = require('express');
//const db = require('../dbConnect');
const verify = require('../verify')
const useQuery = require('../useQuery')

var createRouter = (db) => {
    var router =  express.Router()

    router.get('/candidate', verify(), async (req,res)=>{
        let tableName = `candidate${req.user.username}`
        let sql = `SELECT * FROM ${tableName}`
        useQuery(db, sql)
        .then((result)=>{
            /* 
            result = [
                {electionId:""}
            ]
            */
            
            res.status(200).send(result)
        })
        .catch((err)=>{
            console.log(err)
            res.status(500).send("Unable to Resolve the Request")
        })
    })

    return router 
}

module.exports = createRouter
