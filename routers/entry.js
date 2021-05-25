const express = require('express')

var createRouter =  function (config){
    var router =  express.Router()
    
    router.get('/about', (req,res)=>{
        let db = config
        res.send("This works, Can't log or send db as it is a circular structure but can use it")
    })







    return router
}
module.exports = createRouter