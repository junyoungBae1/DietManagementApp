const userModel = require("../models/user");
const userSchema = require("../utils/validateSchema")
const ExpressError = require("../utils/expressError");
const User = require('../models/user');

//회원가입
module.exports.userRegister = async (req, res, next) => {
  let { username, email, password } = req.body;
  try {

    const exUser = await User.findOne({ where: {email}});

    if (exUser) {
      // return res.redirect('/join?error=exist'); // 에러페이지로 바로 리다이렉트
      console.log("이미 등록된 Email입니다!");
      return res.status(409).json({ message: "이미 등록된 Email입니다!" });
      return 0;
    }


    const newUser = await userModel.register(
        new userModel({username : username,
          email : email}),
         password
    );

    if(newUser){
      console.log("회원가입 성공!");
      return res.status(201).json(newUser);
    }
    else{
      console.log("회원가입 오류!");
      return res.status(500).json({ message: "회원가입 오류!" });
    }

    // req.login(newUser, (err) => {
    //   if (err) {
    //     console.log("tq 회원가입 한 다음에 로그인이 안 돼!")
    //     return next(new ExpressError(err.message, 500));
    //   } else {
    //     // req.flash("success", "부추의 식단관리 사이트 가입을 환영합니다!");
    //     console.log("회원가입 후 로그인 성공!");
    //     res.redirect("/");
    //   }
    // });
  }catch (error){
    console.error(error);
      return next(error);
  }

};

// validate by joi
module.exports.validateUser = async (req, res, next) => {
  try {
    await userSchema.validate(req.body);
    next();
  } catch (error) {
      console.log(error);
    const message = error.details.map((el) => el.message).join(",");
    throw new ExpressError(message, 400);
  }
};

//로그인
module.exports.successLogin = (req, res) => {
  // req.flash("success", "어서오세요!");
  // res.redirect("/");
  console.log("successLogin 시에 isAuthen = " + req.isAuthenticated());
  console.log("로그인 성공!");
    // req.session.save(function(){
    //   res.redirect('/');
    // });
};

//로그아웃

module.exports.logout = async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      throw ExpressError(err, 500);
    } else {
      req.session.destroy();
      console.log("로그아웃 성공!")
      // req.flash("success", "안녕히가세요!");
      res.redirect("/user/login");

    }
  });
  // req.logout();
  //  req.session.save(function(){
  //   res.redirect('/');
  // })
};