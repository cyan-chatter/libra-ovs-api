const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const secretKey = process.env.JWT_SECRET || 'TotalOverdose'

// app.use((req,res,next)=>{
//     if(req.method === 'GET' || req.method === 'POST' || req.method === 'PATCH' || req.method === 'DELETE'){
//         res.status(503).end('Request Temporarily Disabled. Server is Under Maintainance')
//     } else{
//        next()
//     }
// })

const verifyToken = (token) => {
    const decoded = jwt.verify(token, secretKey)
    return decoded
}

const hashWithSalt = (password) => {
    return bcrypt.hash(password, 8)    
}

const comparePassword = (word,hash) => {
    return bcrypt.compare(word, hash)
}

const generateAuthToken = async function (client){
    const token = jwt.sign({username: client.username.toString()},secretKey)
    return token 
}

const auth = {
    hashWithSalt,
    comparePassword,
    generateAuthToken,
    verifyToken
}

module.exports = auth