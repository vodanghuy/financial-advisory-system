let {body, validationResult} = require('express-validator')
let constants = require('../utils/constants')
const {model} = require('mongoose')
var utils = require('util')
let options = {
    password: {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1,
        minNumbers: 1,
    }
}
module.exports = {
    validate: function(req,res,next){
        let errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            })
        }else{
            next();
        }
    },
    UserValidation: 
    [
        // Check validation
        // isAlphanumber() - Check if username is aphanumeric
        body('username').optional().isAlphanumeric().withMessage(constants.ERROR_USERNAME),
        body('password').optional().isStrongPassword(options.password).withMessage(utils.format(constants.ERROR_PASSWORD,
            options.password.minLength,
            options.password.minLowercase,
            options.password.minUppercase,
            options.password.minNumbers,
            options.password.minSymbols
        )),
        body('email').optional().isEmail().withMessage(constants.ERROR_EMAIL),
        body('avatarURL').optional().isURL().withMessage(constants.ERROR_AVATAR),
    ]
}