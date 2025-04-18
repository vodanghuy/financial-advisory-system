const { get } = require('mongoose');
let roleSchema = require('../schemas/role');

module.exports = {
    // Get all roles
    getAllRoles: async function(){
        return await roleSchema.find();
    },

    // Get role by id
    getRoleById: async function(id){
        let role = await roleSchema.findById(id);
        if(role)
        {
            return role;
        }
        else
        {
            throw new Error('Không tìm thấy role');
        }
    },

    // Create role
    createRole: async function(name){
        let newRole = new roleSchema({
            name: name,
        })
        await newRole.save();
        return newRole;
    },

    // Update role
    updateRole: async function(id, body){
        let updatedRole = await roleSchema.findById(id);
        if(!updatedRole)
        {
            throw new Error('Không tìm thấy role');
        }
        if(body.name)
        {
            let existingRole = await roleSchema.findOne({
                name: body.name
            });
            if(existingRole)
            {
                throw new Error('Role đã tồn tại');
            }
            updatedRole.name = body.name;
        }
        await updatedRole.save();
        return updatedRole;
    },

    // Delete role
    deleteRole: async function(id){
        let deletedRole = await roleSchema.findById(id);
        if(!deletedRole)
        {
            throw new Error('Không tìm thấy role');
        }
        deletedRole.isDeleted = true;
        await deletedRole.save();
        return deletedRole;
    }
}