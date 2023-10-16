const User = require('../models/user');
const passport = require("passport");
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt");
require('dotenv').config();
const saltRounds = parseInt(process.env.SALT);

//회원가입
module.exports.userRegister = async (req, res, next) => {
  let { username, email, password,phonenum } = req.body;
  if (
    username === "" ||
    email === "" ||
    password === "" ||
    phonenum === ""
  ) {
    console.log("정보 입력 오류");
    return res.json({ registerSuccess: false, message: "정보를 입력하세요" });
  }

  const sameEmailUser = await User.findOne({ where: {email}});
  if (sameEmailUser !== null) {
        console.log("이미 존재하는 이메일입니다");
    return res.json({
      registerSuccess: false,
      message: "이미 존재하는 이메일입니다",
    });
  }

  // 솔트 생성 및 해쉬화 진행
  bcrypt.genSalt(saltRounds, (err, salt) => {
    // 솔트 생성 실패시
    if (err){
      console.log(err);
    return res.status(500).json({
      registerSuccess: false,
      message: "비밀번호 해쉬화에 실패했습니다.",
    });
  }
    // salt 생성에 성공시 hash 진행
    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) {
      console.log("해쉬화 오류");
      return res.status(500).json({
        registerSuccess: false,
        message: "비밀번호 해쉬화에 실패했습니다.",
      });
    }
      // 비밀번호를 해쉬된 값으로 대체
      password = hash;

      const user = await new User({
        username : username,
        email: email,
        password,
        phonenum : phonenum,
      });

      user.save()
        .then(user => {
          console.log(user.username + "님, 회원가입 완료!");
          //웹용
          //res.send("<script> alert('회원가입 되었습니다.'); location.href='/';</script>");
            return res.json({ registerSuccess: true });
        })
        .catch(err => {
          console.log("Save 오류");
          return res.json({registerSuccess: false, message: err});
        });
     });
    });
  };


//로그인
module.exports.userLogin = (req, res,next) => {
  passport.authenticate('local', {session: false}, async (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        message: '로그인 authen 실패..',
        user: user
      });
    }

    req.login(user, {session: false}, async (error) => {
      if (error) return next(error);

      const token = jwt.sign({
        id: user.email
      }, process.env.TOKENKEY,
      {
        expiresIn: '15m', //15분 유효
        // issuer: 'localhost',
        // subject: 'user_info'
      });

      user.token = token;

      await user.save()
                .then(user => {
                  console.log(user.username + "님, 환영합니다!");
                  //웹용
                  //res.send("<script> alert('로그인 되었습니다.'); location.href='/';</script>");
                  return res.status(200).json({loginSuccess:true, token});
                })
                .catch(err => {
                  console.log("Token Save 오류");
                  return res.json({loginSuccess:false,message : err});
                });
    });
  })(req,res,next);
};

//로그아웃

module.exports.userLogout = async (req, res) => {
     const user = req.user;
    try {
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Token 유효기간 만료..'
            });
        }

        user.token = null;

        await user.save()
                  .then(user => {
                      console.log(user.username + "님, 안녕히 가세요!");
                      return res.status(200)
                                 .json({ logoutSuccess:true });
                  })
                  .catch(err => {
                      console.log("Token Delete 오류");
                      return res.json({ logoutSuccess:false,message : err});
                  });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: '서버 에러'
        });
    }
};