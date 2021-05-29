const express = require('express');
const auth = require('../auth');
const verify = require('../verify');
const useQuery = require('../useQuery');

var validateEmailSyntax = (email) => {
    let dot=0, atr=0;
    for(let i=0; i<email.length; ++i){
        if (email[i] == '.') ++dot;
        if(email[i] == '@') ++atr;
    }
    if(atr>0 && dot>0) return true;
    return false;
}

var validateUsernameSyntax = (un) =>{
    let ac;
    for(let i=0; i<un.length; ++i){
        ac = un.charCodeAt(i);
        if(!((ac >=48 && ac <= 57) || (ac >= 65 && ac <= 90) || (ac>=97 && ac<=122))){
            return false;
        }
    }
    return true;
}

var isUsernameAlreadyTaken = async (db,un) => {
    let sql = 'SELECT * FROM users WHERE username = ?'
    return useQuery(db, sql, [un])
}

var isEmailAreadyUsed = async (db,email) => {
    let sql = 'SELECT * FROM users WHERE email = ?'
    return useQuery(db, sql, [email])
}

var createRouter =  function (db){
    var router =  express.Router()
    
    router.get('/about', (req,res)=>{
        res.send("This works, Can't log or send db as it is a circular structure but can use it")
    })

    router.post('/registeruser', async (req,res)=>{    

        if(!req.body) res.status(400).send('Invalid Request Syntax')
        if(!validateEmailSyntax(req.body.email)){
            return res.status(400).send('Invalid Email Syntax')
        }
        if(!validateUsernameSyntax(req.body.username)){
            return res.status(400).send('Invalid Username Syntax')
        }
        let d1;
        isUsernameAlreadyTaken(db,req.body.username)
        .then(result=>{
            console.log("username check runs", result);
            if(result.length > 0) d1 = true;
            else d1 = false;
        })  
        .then(()=>{
            if(d1){
                return res.status(409).send('Username Alerady Taken')
            }
            let d2; 
            isEmailAreadyUsed(db,req.body.email)
            .then(result=>{
                console.log("email check runs", result);
                if(result.length > 0) d2 = true;
                else d2 = false;
            })
            .then(async ()=>{
                if(d2){
                    return res.status(409).send('A User Has Already Registered With This Email')
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
                    res.status(200).send('User Added Successfully');
                    // const tableName = 'userTokensFor' + userData.username
                    // let sql2 = `CREATE TABLE ${tableName}(token VARCHAR(255))`;
                    
                    // db.query(sql2, (err,result)=>{
                    //     if(err) throw err;
                    //     console.log(result);
                    //     res.status(200).send('User Added Successfully');
                    // })
                })
            })
        })
        
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
                // let tableName = `userTokensFor${user.username}`
                // let sql2 = `INSERT INTO ${tableName} VALUES (?)` 
                let sql2 = `INSERT INTO user_tokens (username, token) VALUES (?, ?)` 
                db.query(sql2, [req.body.username, token], (err,result)=>{
                    if(err){
                        console.log(err);
                        throw err;
                    } 
                    console.log(result);
                    const userData = {
                        username : user.username,
                        name : user.name,
                        email : user.email,
                        org_id : user.org_id,
                        token
                    }
                    res.status(200).send({user : userData})
                })        
            }else{
                res.status(400).send("Incorrect Password")
            }
        })

    })

    router.get('/logout', verify(), async (req,res)=>{
        //let tableName = `userTokensFor${req.user.username}`
        //let sql = `DELETE FROM ${tableName} WHERE token = ?`
        let sql = `DELETE FROM user_tokens WHERE username = ? AND token = ?`
        db.query(sql, [req.user.username, req.token], (err,result)=>{
            if(err) throw err;
            console.log(result)
            res.status(200).send("User is Logged Out")
        })
    })

    return router
}
module.exports = createRouter