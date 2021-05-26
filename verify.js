const auth = require('./auth');
const db = require('./dbConnect');

const verify = ()=>{
    return async(req, res, next)=>{         
        try{
            let user
            const token = req.header('Authorization')
            const decoded = auth.verifyToken(token)
            console.log("decoded: ", decoded)
            db.query('SELECT * FROM users WHERE username = ?', [decoded.username], (err,result)=>{
                if(err) throw err;
                if(result.length === 0){
                    return res.status(401).send("Invalid Credentials")        
                } 
                user = result[0];
                let tablename = `userTokensFor${user.username}`
                let sql = `SELECT * FROM ${tablename} WHERE token = ?`
                db.query(sql,[token],(err,result)=>{
                    if(err) throw err;
                    console.log(result);
                    if(result.length <= 0){
                        return res.status(401).send("Invalid Credentials")
                    }
                    req.token = token
                    req.user = user
                    next()        
                })        
            })
        }catch(e){
            console.log(e)
            res.status(401).send("Invalid Credentials")
        }    
    }
} 

module.exports = verify