const {Strategy: LocalStrategy} = require("passport-local");
const User = require("../models/user");

//사전에 로그인 되었는지 확인
module.exports.isLoggedIn = (req, res, next) => {
  console.log("isLoggedIn 시에 isAuthen = " + req.isAuthenticated());
  if (!req.isAuthenticated()) {
    // req.flash("error", "사이트 이용을 위해 로그인이 필요합니다.");
    console.log("(isLoggedIn)로그인 필요");
    return res.redirect("/user/login");
  }
  next();
};

//사전에 로그인이 안되었는지 확인
module.exports.isNotLoggedIn = (req, res, next) => {
  console.log("isNotLoggedIn 시에 isAuthen = " + req.isAuthenticated());
  if (!req.isAuthenticated()) {
    next();
  } else{
    console.log("(isNotLoggedIn)이미 로그인 되어 있음");
     // res.redirect(`/?error=${message}`);
  }
};


//로그인 시도 시 인증 전략(Local)
module.exports.LocalS =new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email : email });

        if(user) {
           user.authenticate(password, (err, authenticatedUser, error) => {
             if (err) {
               return done(err);
             }
             if (authenticatedUser) {
               // User authenticated correctly
               console.log("LocalS에서 authen 잘 됨!");
               return done(null, authenticatedUser);
             } else {
               // Passwords did not match
               console.log("Incorrect password.");
               return done(null, false, {message: "Incorrect password."});
             }
           });
        } else{
          console.log("Incorrect username.");
          return done(null, false, { message: "Incorrect username." });
        }
      } catch (err) {
        return done(err);
      }
    }
  );