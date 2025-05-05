let userSchema = require('../schemas/user')
let roleSchema = require('../schemas/role')
let bcrypt = require('bcrypt')
let moment = require('moment')

module.exports = {
    // Create user
    createUser: async function(body) {
        // Check if user already exists
        let existingEmail = await userSchema.findOne({ email: body.email })
        if(existingEmail) {
            throw new Error("Email đã tồn tại")
        }
        let existingPhoneNumber = await userSchema.findOne({ tel: body.tel })
        if(existingPhoneNumber) {
            throw new Error("Số điện thoại đã tồn tại")
        }
        let role = await roleSchema.findOne({
            name: body.role
        })
        let user = new userSchema({
            password: body.password,
            email: body.email,
            fullName: body.fullName,
            tel: body.tel,
            dateOfBirth: body.dateOfBirth,
            gender: body.gender,
            role: role._id
        })
        user = await user.save()
        return user
    },
    // Get all users
    getAllUsers: async function() {
        let users = await userSchema.find({ isDeleted: false }).populate('role')
        return users
    },
    // Get user by ID
    getUserById: async function(id) {
        let user = await userSchema.findById(id).populate('role')
        if(!user) {
            throw new Error("Không tìm thấy người dùng")
        }
        return user
    },
    // Update user
    updateUser: async function(id, body){
        let user = await userSchema.findById(id)
        if(!user) {
            throw new Error("Không tìm thấy người dùng")
        }
        if(body.email) {
            let existingEmail = await userSchema.findOne({ email: body.email })
            if(existingEmail) {
                throw new Error("Email đã tồn tại")
            }
        }
        if(body.fullName){
            user.fullName = body.fullName
        }
        if(body.phoneNumber){
            user.phoneNumber = body.phoneNumber
        }
        if(body.dateOfBirth){
            user.dateOfBirth = body.dateOfBirth
        }
        if(body.gender){
            user.gender = body.gender
        }
        if(body.address){
            user.address = body.address
        }
        if(body.role){
            let role = await roleSchema.findOne({
                name : body.role
            })
            user.role = role._id
        }
        if(body.password){
            user.password = body.password
        }
        await user.save()
        return user
    },
    // Delete user
    deleteUser: async function(id) {
        let user = await userSchema.findById(id)
        if(!user) {
            throw new Error("Không tìm thấy người dùng")
        }
        user.isDeleted = true
        await user.save()
        return user
    },
    // Check login
    checkLogin: async function(email, password)
    {
        let user = await userSchema.findOne({ email: email }).populate({
            path: 'role',
            select: 'name'
        })
        if(!user) {
            throw new Error("Email hoặc mật khẩu không hợp lệ")
        }
        else
        {
            if(bcrypt.compareSync(password, user.password)){
                return user
            }
            else
            {
                throw new Error("Email hoặc mật khẩu không hợp lệ")
            }
        }
    },

    // Change password
    changePassword: async function(id, oldPassword, newPassword) {
        let user = await userSchema.findById(id)
        if(bcrypt.compareSync(oldPassword, user.password)){
            throw new Error("Mật khẩu cũ không đúng")
        }
        else
        {
            user.password = newPassword;
            await user.save()
        }
    },

    // Get user by email
    getUserByEmail: async function(email) {
        let user = await userSchema.findOne({ email: email })
        if(!user) {
            throw new Error("Không tìm thấy người dùng")
        }
        return user
    },
    // Get user by token
    getUserByToken: async function(token){
        let user = await userSchema.findOne({
            ResetPasswordToken: token,
        })
        if(!user) {
            throw new Error("Không tìm thấy người dùng")
        }
        return user
    }
}