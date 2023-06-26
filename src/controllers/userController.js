const userModel = require('../models/userModel')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const {isValid} = require('../validation/validator')
 require('dotenv').config()
const {SECRET_KEY} = process.env

const createUser = async (req,res)=>{
  try {
    let {title,name,phone,email,password,address} = req.body
   
 if(!isValid(title)||!isValid(name)||
 !isValid(phone)||!isValid(email)||!isValid(password)){
    return res.status(400).send({
      status : false, 
      message : "invalid mandatory input" 
    })
 }

  title = title.trim()
  if(!["Mr", "Mrs", "Miss"].includes(title)){
    return res.status(400).send({
      status : false, 
      message : "title should be from Mr , Mrs , Miss "
    })
  }
   
  //checking unique number

  phone = phone.trim()
  if(!validator.isMobilePhone(phone)){
    return res.status(400).send({
      status : false, 
      message : "invalid phone" 
    })
}
  const phoneAlreadyExit = await userModel.findOne({phone})
  if(phoneAlreadyExit) {
    return res.status(400).send({
      status : false, 
      message : "phone already registered" 
    })
  }

  // Email validation

  email = email.trim()
if(!validator.isEmail(email)){
    return res.status(400).send({
      status : false, 
      message : "invalid email" 
    })
}
const emailAlreadyExit = await userModel.findOne({email})
  if(emailAlreadyExit) {
    return res.status(400).send({
      status : false, 
      message : "email already registered" 
    })
  }

  //  password length validation

if(password.length<8 || password.length>15){
    return res.status(400).send({
      status : false, 
      message : "password can contain character between 8 to 15" 
    })
}

const user = await userModel.create({title,name,phone,email,password,address}) 
    
return res.status(201).send({
  status : true, 
  data : user
})
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
       let  {email, password}  = req.body
      if(!isValid(email)|| !isValid(password)){
        return res.status(400).send({
          status : false, 
          message : "invalid email or password" 
        })
    }
     
    //login verification  
          
        const user = await userModel.findOne({email, password})     

        if(!user){
            return res.status(401).send({
              status : false, 
              message : "invalid email or password" 
            })
        }
          
        //generating jwt token

      const token = jwt.sign({userId : user._id}, SECRET_KEY)

    return res.status(200).send({
      status : true, 
      data : {token : token} 
    })
    } catch (error) {
      res.status(500).send({
        status: false,
        error: error.message
      })
    }
}

module.exports= {createUser, userLogin}