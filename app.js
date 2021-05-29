const express = require('express')
const path = require('path')

let db = require('./dbConnect')

const init = require('./routers/init')
const global = require('./routers/global')
const entry = require('./routers/entry')
const conduct = require('./routers/conduct')
const candidate = require('./routers/candidate')
const voter = require('./routers/voter')

const port = process.env.PORT||3000

const app = express()

app.use(express.json())

const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

//Using the Routes Here

app.use(init(db))
app.use(global(db))
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
