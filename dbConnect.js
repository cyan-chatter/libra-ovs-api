const mysql = require('mysql')

const dbrootpass = process.env.DBROOTPASS||'thunder7'

const dbname = process.env.DBNAME||'libradevdbmain' // set dbname

const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : dbrootpass 
    //,database : dbname //comment this line if new db dbname is to be created
})

db.connect((err) => {
    if(err){
        throw err
    }
    console.log('MySql Connected')
})

module.exports = db