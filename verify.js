const auth = require('./auth');
const db = require('./dbConnect');

const verify = ()=>{
    return async(req, res, next)=>{         
        try{
            let user;
            const token = req.header('Authorization').replace('Bearer ','')
            const decoded = auth.verifyToken(token)
            db.query('SELECT * FROM users WHERE username =', [decoded.username], (err,result)=>{
                if(err) throw err;
                if(result.length === 0){
                    throw new Error()
                } 
                user = result[0];
                let tablename = `userTokensFor${user.username}`
                let sql = `SELECT * FROM ${tablename} WHERE token = ?`
                db.query(sql,[decoded.token],(err,result)=>{
                    if(err) throw err;
                    console.log(result);
                    if(result.length <= 0){
                        throw new Error()
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