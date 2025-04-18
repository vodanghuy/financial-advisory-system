var bcrypt = require('bcrypt')
var mongoose = require('mongoose')
var moment = require('moment')
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
        type: String,
        required: true,
        validate: {
            validator: function (value) {
              return moment(value, 'DD/MM/YYYY', true).isValid(); // Kiểm tra định dạng
            },
            message: 'Invalid date format. Use DD/MM/YYYY',
          },
    },
    password:{
        type: String,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    isDeleted:{
        type: Boolean,
        default: "false"
    },
    role:{
        type: mongoose.Types.ObjectId,
        rel: 'role',
        required: true
    }
},{
    timestamp: true
})
// Mã hóa mật khẩu
userSchema.pre('save', function(next) {
    if(this.isModified('password')){
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(this.password, salt);
        this.password = hash;
    }
    next();
})
module.exports = mongoose.model('user', userSchema)