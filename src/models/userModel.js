// { 
    // title: {string, mandatory, enum[Mr, Mrs, Miss]},
    // name: {string, mandatory},
    // phone: {string, mandatory, unique},
    // email: {string, mandatory, valid email, unique}, 
    // password: {string, mandatory, minLen 8, maxLen 15},
//     address: {
//       street: {string},
//       city: {string},
//       pincode: {string}
//     },
//     createdAt: {timestamp},
//     updatedAt: {timestamp}
//   }

const { default: mongoose } = require("mongoose");

const userSchema= new mongoose.Schema({
    title: {
        type: String,
        required: true,
        enum: [Mr, Mrs, Miss],
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        street: String,
        city: String,
        pincode: String
    } 
}, {timestamps: true})


module.exports= mongoose.Model('User', userSchema)
