const express= require('express')
const route= require('./routes/route')
var bodyParser = require('body-parser');
const { default: mongoose } = require('mongoose')
require('dotenv').config()
const {MONGO_URI}  = process.env
const app= express()

const multer= require("multer");
const { AppConfig } = require('aws-sdk');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use( multer().any())
mongoose.connect(MONGO_URI, {
    useNewUrlParser:true
})
.then( () => console.log('mongodb is connected'))
.catch( err => console.log(err.message))

app.use('/', route)

app.listen(process.env.PORT, () => {
    console.log(`express is running on port ${process.env.PORT}`)
})