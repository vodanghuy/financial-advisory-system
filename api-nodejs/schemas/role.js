var bcrypt = require('bcrypt')
var mongoose = require('mongoose')
let roleSchema = mongoose.Schema({
    name:{
        type: String,
        unique: true,
        required: true
    },
    isDeleted:{
        type: Boolean,
        default: "false"
    }
},{
    timestamp: true
})
module.exports = mongoose.model('role', roleSchema)