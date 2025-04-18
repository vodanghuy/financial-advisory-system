var express = require("express");
var multer = require("multer");
var router = express.Router();
var userController = require("../controllers/users");
// Get check_authentication and check_authorization functions
let {
  check_authentication,
  check_authorization,
} = require("../utils/check_auth");
// Get constants
let constants = require("../utils/constants");
// Get validator
let { validate, UserValidation } = require("../utils/validator");
 let path = require('path')
 let form_data = require('form-data')
 let fs = require('fs')
 let axios = require('axios')

// Get all users
router.get(
  "/",
  async function (req, res, next) {
    try {
      let users = await userController.getAllUsers();
      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }
);
// Get user by ID
router.get(
  "/:id",
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
      let user = await userController.getUserById(req.params.id);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
);
// Create user
// check_authentication,  check_authorization(constants.ADMIN_PERMISSION),
router.post("/",   UserValidation,  validate,
  async function (req, res, next) {
    try {
      let user = await userController.createUser(req.body);
      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
);
// Update user
router.put(
  "/:id",
  check_authentication,
  check_authorization(constants.USER_PERMISSION),
  UserValidation,
  validate,
  async function (req, res, next) {
    try {
      let user = await userController.updateUser(req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
);
// Delete user
router.delete(
  "/:id",
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
      let user = await userController.deleteUser(req.params.id);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
);
let avatarPath = path.join(__dirname, "../public/avatars");
let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, avatarPath),
  filename: (req, file, cb) =>
    cb(null, new Date(Date.now()).getTime() + "-" + file.originalname),
});
let upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/image/)) {
      cb(new Error("tao chi nhan file anh thoi"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
// Upload avatar
router.post("/change_avatar",check_authentication,upload.single("avatar"),async function (req, res, next) {
    if (req.file) {
      let newform = new form_data();
      let filepath = path.join(avatarPath, req.file.filename);
      newform.append("avatar", fs.createReadStream(filepath));
      let result = await axios.post("http://localhost:4000/upload", newform, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fs.unlinkSync(filepath);
      let newURL = result.data.message;
      req.user.avatar = newURL;
      await req.user.save();
      res.status(200).send({
        success: true,
        message: req.user,
      });
    }
  }
);
module.exports = router;
