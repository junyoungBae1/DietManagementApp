const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/user");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn,isNotLoggedIn } = require("../utils/middlewares");

//회원가입
router.post('/register', userController.validateUser,
            catchAsync(userController.userRegister)
        );

//로그인
router.post(
  "/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local",(authError, user, info) => {
       if (authError) {
         console.error(authError);
         return next(authError); // 에러처리 미들웨어로 보낸다.
      }
       if (!user) {
         // done()의 3번째 인자 { message: '비밀번호가 일치하지 않습니다.' }가 실행
           console.log("비밀번호가 일치하지 않습니다.");
           return res.redirect(`/?loginError=${info.message}`);
      }
   //? done(null, exUser)가 처리된경우, 즉 로그인이 성공(user가 false가 아닌 경우), passport/index.js로 가서 실행시킨다.
      return req.login(user, loginError => {
         //? loginError => 미들웨어는 passport/index.js의 passport.deserializeUser((id, done) => 가 done()이 되면 실행하게 된다.
         // 만일 done(err) 가 됬다면,
         if (loginError) {
            console.log("로그인 에러.");
            return next(loginError);
         }
         // done(null, user)로 로직이 성공적이라면, 세션에 사용자 정보를 저장해놔서 로그인 상태가 된다.
          userController.successLogin(req);
          return res.redirect('/');
      });
   })(req, res, next); //! 미들웨어 내의 미들웨어에는 콜백을 실행시키기위해 (req, res, next)를 붙인다.
});

//로그아웃

router.get("/logout", isLoggedIn, catchAsync(userController.logout));
// router.get("/logout", isLoggedIn, userController.logout);


module.exports = router;