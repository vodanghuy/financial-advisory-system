let jwt = require("jsonwebtoken");
let constants = require("../utils/constants"); // Get secret key
var userController = require("../controllers/users"); // Get user controller
module.exports = {
  check_authentication: async function (req, res, next) {
    let token;
    // Check if user is logged in
    if (
      !req.headers ||
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    ) {
        if(req.signedCookies.token) {
            token = req.signedCookies.token;
        }
    }
    else {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];
    }
    if(!token){
      console.log(token);
        return next(new Error("Bạn chưa đăng nhập"));
    }
    // Get user id from token
    let result = jwt.verify(token, constants.SECRET_KEY);
    let user = await userController.getUserById(result.id);
    // Check if token is expired
    if (result.expireIn > Date.now()) {
      req.user = user;
      next();
    } else {
      next(new Error("Token đã hết hạn"));
    }
  },
  // Check if user has permission to access resource
  check_authorization: function (roles) {
    return function (req, res, next) {
      let roleOfUser = req.user.role.name;
      let requiredRole = roles;
      // Check if role of user is in required roles
      if (requiredRole.includes(roleOfUser)) {
        next();
      } else {
        next(new Error("Bạn không có quyền truy cập!"));
      }
    };
  },
};
