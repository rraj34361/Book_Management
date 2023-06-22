const userModel = require('../models/userModel')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const {isValid} = require('../validation/validator')

const createUser = async (req,res)=>{
  try {
    let {title,name,phone,email,password,address} = req.body
   
 if(!isValid(title)||!isValid(name)||!isValid(phone)||!isValid(email)||!isValid(password)){
    return res.status(400).send({status : false, message : "invalid mandatory input" })
 }
    
 //title validation

  title = title.trim()
  if(!["Mr", "Mrs", "Miss"].includes(title)){
    return res.status(400).send({status : false, message : "title should be from Mr , Mrs , Miss "})
  }
   
  //checking unique number

  phone = phone.trim()
  const allReady = await userModel.findOne({phone})
  if(allReady) {
    return res.status(400).send({status : false, message : "already registered" })
  }

  // Email validation

  email = email.trim()
if(!validator.isEmail(email)){
    return res.status(400).send({status : false, message : "invalid email" })
}
const allReadyEmail = await userModel.findOne({email})
if(allReadyEmail) {
  return res.status(400).send({status : false, message : "already registered" })
}

  //  password length validation

if(password.length<=8 || password.length>=15){
    return res.status(400).send({status : false, message : "password can contain character between 8 to 15" })
}

const user = await userModel.create({title,name,phone,email,password,address}) 
    
return res.status(201).send({status : true, data : user})
  } catch (error) {
    res.status(500).send({
      status: false,
      error: error.message
    })
  }
}

// ********************************************************************************** //

const userLogin = async (req,res)=>{
    try {
      if(!isValid(email)|| !isValid(password)){
        return res.status(400).send({status : false, message : "invalid email or password" })
    }
    
  email = email.trim()
  if(!validator.isEmail(email)){
      return res.status(400).send({status : false, message : "invalid email" })
  }
  
if(password.length<=8 || password.length>=15){
    return res.status(400).send({status : false, message : "password can contain character between 8 to 15" })
}
     
    //          login verification  
          
        const user = await userModel.findOne({email, password})     

        if(!user){
            return res.status(401).send({status : false, message : "invalid email or password" })
        }
          
        //user verified generating jwt token

      const token = jwt.sign({userId : user._id}, SECRET_KEY)

return res.status(200).send({status : true, data : {token : token} })
    } catch (error) {
      res.status(500).send({
        status: false,
        error: error.message
      })
    }
}

module.exports= {createUser, userLogin}