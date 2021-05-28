const db = require('../dbConnect');
const express = require('express');
const useQuery = require('../useQuery');
const verify = require('../verify');

var createRouter = (db) => {
    var router = express.Router();
    let table = 'candidates';
    router.get('/candidate', verify(), (req, res) => {
        let sql = `SELECT eid FROM ${table} WHERE username = ?`;
        useQuery(db, sql, [req.user.username])
        .then((result) => {
            console.log(result);
            res.send(result);
        })
    })
    return router;
}

module.exports = createRouter;