var express = require('express');
var router = express.Router();
var roleController = require('../controllers/roles');

// Get all roles
router.get('/', async function (req, res, next) {
    try {
        let roles = await roleController.getAllRoles();
        res.status(200).send(roles);
    } catch (error) {
        res.status(404).send({
            message: error.message
        });
    }
});

// Get role by id
router.get('/:id', async function (req, res, next) {
    try {
        let role = await roleController.getRoleById(req.params.id);
        res.status(200).send(role);
    } catch (error) {
        res.status(404).send({
            message: error.message
        });
    }
});

// Create a role
router.post('/', async function (req, res, next) {
    try {
        let body = req.body;
        let newRole = await roleController.createRole(body.name);
        res.status(200).send(newRole);
    } catch (error) {
        res.status(404).send({
            message: error.message
        });
    }
});

// Update role
router.put('/:id', async function (req, res, next) {
    try {
        let updatedRole = await roleController.updateRole(req.params.id, req.body);
        res.status(200).send(updatedRole);
    } catch (error) {
        res.status(404).send({
            message: error.message
        });
    }
});

// Delete role
router.delete('/:id', async function (req, res, next) {
    try {
        let deletedRole = await roleController.deleteRole(req.params.id);
        res.status(200).send(deletedRole);
    } catch (error) {
        res.status(404).send({
            message: error.message
        });
    }
});

module.exports = router;
