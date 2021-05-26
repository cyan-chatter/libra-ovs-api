const express = require('express');
const { verify } = require('jsonwebtoken');
const auth = require('../auth');
const db = require('../dbConnect');
const verify = require('../verify')

var validateEmailSyntax = (email) => {
    let dot=0, atr=0;
    for(let i=0; i<email.length; ++i){
        if (email[i] == '.') ++dot;
        if(email[i] == '@') ++atr;
    }
    if(atr>0 && dot>0) return true;
    return false;
}

var isUsernameAlreadyTakenOrInvalid = (un) => {
    
    for(let u=0; i<un.length; ++i){
        let ac = un.charCodeAt(i);
        if(!((ac >=48 && ac <= 57) || (ac >= 65 && ac <= 90) && (ac>=97 && ac<=122))){
            return false;
        }
    }
    
    let sql = 'SELECT * FROM `users` WHERE `username` = ?'
    db.query(sql, [un], (err,result)=>{
        if(err) throw err;
        console.log(result);
        if(result.length > 0) return true;
        else return false;
    })
    
}

var isEmailAreadyUsed = (email) => {
    let sql = 'SELECT * FROM `users` WHERE `email` = ?'
    db.query(sql, [email], (err,result)=>{
        if(err) throw err;
        console.log(result);
        if(result.length > 0) return true;
        else return false; 
    })
    
}

var createRouter =  function (config){
    var router =  express.Router()
    
    router.get('/about', (req,res)=>{
        let db = config
        res.send("This works, Can't log or send db as it is a circular structure but can use it")
    })

    router.post('/registeruser', async (req,res)=>{    

        if(!req.body) res.status(400).send('Invalid Request Syntax')
        if(!validateEmailSyntax(req.body.email)){
            res.status(400).send('Invalid Email Syntax')
        }
        if(isUsernameAlreadyTakenOrInvalid(req.body.username)){
            res.status(409).send('Username Alerady Taken')
        }
        if(isEmailAreadyUsed(req.body.email)){
            res.status(409).send('A User Has Already Registered With This Email')
        }
        if(req.body.password.length < 8) res.status(406).send('Password Must Have Atleast 8 Characters')
        //409- conflict, 406 - not acceptable

        const hashedPassword = await auth.hashWithSalt(req.body.password)
        
        const userData = { 
            username : req.body.username,
            name : req.body.name,
            email : req.body.email,
            age : req.body.age,
            password : hashedPassword
        }

        let sql1 = 'INSERT INTO users SET ?';
        db.query(sql1, userData, (err, result) => {
            if(err) throw err;
            console.log(result);
            const tableName = 'userTokensFor' + userData.username
            let sql2 = `CREATE TABLE ${tableName}(token VARCHAR(255))`;
            
            db.query(sql2, (err,result)=>{
                if(err) throw err;
                console.log(result);
                res.status(200).send('User Added Successfully');
            })
        });
    
    })


    router.post('/login', async (req,res)=>{
        if(!req.body) res.status(400).send('Invalid Request Syntax')
        let user,word,hash,token;
        let sql = 'SELECT * FROM `users` WHERE `username` = ?'
        db.query(sql, [req.body.username], async (err,result)=>{
            if(err){
                console.log(err);
                throw err;
            } 
            if(result.length <= 0) res.status(406).send("User not Found");
            user = result[0]
            console.log(user);
            hash = user.password
            word = req.body.password
            const isMatch = await auth.comparePassword(word, hash);
            if(isMatch){
                token = auth.generateAuthToken(user)
                //sql query - save the token into userTokens table
                let tableName = `userTokensFor${user.username}`
                let sql2 = `INSERT INTO ${tableName} VALUES (?)` 
                db.query(sql2, [token], (err,result)=>{
                    if(err){
                        console.log(err);
                        throw err;
                    } 
                    console.log(result);
                    const userData = {
                        username : user.username,
                        name : user.name,
                        email : user.email,
                        token
                    }
                    res.status(200).send({user : userData})
                })        
            }
        })

    })

    router.get('/logout', verify(), async (req,res)=>{
        let tableName = `userTokensFor${req.user.username}`
        db.query('DELETE FROM ? WHERE token = ?', [tableName, req.token], (err,result)=>{
            if(err) throw err;
            console.log(result)
            res.status(200).send("User is Logged Out")
        })
    })

    
    return router
}
module.exports = createRouter