const express= require('express')
const route= require('./routes/route')
const { default: mongoose } = require('mongoose')
require('dotenv').config()

const app= express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParse:true
})
.then( () => console.log('mongodb is connected'))
.catch( err => console.log(err.message))

app.use('/', route)

app.listen(process.env.PORT, () => {
    console.log(`express is running on port ${process.env.PORT}`)
})