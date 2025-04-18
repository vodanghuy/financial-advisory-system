var bcrypt = require('bcrypt')
var mongoose = require('mongoose')
let userSchema = mongoose.Schema({
    email:{
        type: String,
        unique: true,
        required: true
    },
    tel:{
        type: String,
        unique: true,
        required: true
    },
    fullName:{
        type: String,
        required: true
    },
    dateOfBirth:{
        type: Date,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    gender:{
        type: String,
        required: true
    }
},{
    timestamp: true
})
module.exports = mongoose.model('user', userSchema)