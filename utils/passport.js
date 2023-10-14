const passport = require('passport');
const passportJWT = require('passport-jwt');
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const User = require("../models/user");
const bcrypt = require("bcrypt");
require('dotenv').config();

module.exports = () => {
    // Local Strategy
    passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
    },
    async function (email, password, done) {
      try {
        const user = await User.findOne({ email: email});
        if (!user) {
          console.log('email 오류!');
          return done(null, false, { message: 'email 오류!' });
        }

        const match = await bcrypt.compare(password,user.password);
        if (!match) {
          console.log('password 오류!');
          return done(null, false, { message: 'password 오류!' });
        }

        console.log('로그인 성공!');
        return done(null, user);

      } catch (err) {
         return done(err);
      }
    }
    )
);

    //JWT Strategy
    passport.use(new JWTStrategy({
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey   : process.env.TOKENKEY
        },
        function (jwtPayload, done) {
            return User.findOne({ email: jwtPayload.id })
                .then(user => {
                     console.log("JWTStrategy 인증 완료!")
                    return done(null, user);
                })
                .catch(err => {
                    console.log("JWTStrategy 오류!")
                    return done(err);
                });
        }
    ));
}