const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const catchAsync = require("../utils/catchAsync");
const passport = require('passport');


//회원가입
router.post("/register", catchAsync(userController.userRegister));

//로그인
router.post("/login",userController.userLogin);

//로그아웃
router.post("/logout",passport.authenticate('jwt',{session :false}),userController.userLogout);


module.exports = router;