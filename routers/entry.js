const express = require('express')

var createRouter =  function (config){
    var router =  express.Router()
    
    router.get('/entry', (req,res)=>{
        let db = config
        res.send("This will Work")
    })







    return router
}
module.exports = createRouter