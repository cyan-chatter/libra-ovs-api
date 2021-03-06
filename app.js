const express = require('express')
const path = require('path')

let db = require('./dbConnect')

const election = require('./routers/election')
const entry = require('./routers/entry')
const conduct = require('./routers/conduct')
const candidate = require('./routers/candidate')
const voter = require('./routers/voter')

const port = process.env.PORT||3000

const app = express()

app.use(express.json())

const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

//Uncomment Only During Creating the DB Structure
//-----------------------------------------------
// const init = require('./routers/init')
// app.use(init(db))
//-----------------------------------------------


app.use(election(db))
app.use(entry(db))
app.use(conduct(db))
app.use(voter(db))
app.use(candidate(db))


app.get('/', (_, res) => {
    res.send("Welcome to Libra - an API for Online Voting")
})

app.get('*',(_,res)=>{
    res.status(404).send("The Requested Operation is Not Found")
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
