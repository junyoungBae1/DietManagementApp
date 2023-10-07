const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
const session = require("express-session");
const flash =  require("connect-flash");

var cookieParser = require('cookie-parser');
var logger = require('morgan');

const passport = require("passport");
const User = require("./models/user");
const {LocalS} = require("./utils/middlewares");

var userRouter = require("./routes/user");

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(logger('dev'));

const port = 3000;

mongoose
  .connect(process.env.DBURI)
  .then(() => {
    console.log("DB에 연결되었습니다!");
  })
  .catch((err) => {
    console.log("DB 연결중 문제가 발생했습니다...");
    console.log(err);
  });

// session
const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
    //   expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    //   maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  };

app.use(session(sessionConfig));

//로그인 인증
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.use(LocalS);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/user',userRouter);



//그냥 화면 잘 뜨는지 보려고
  app.get("/", (req, res) => {
    res.end("HELLO!!","utf-8");
  });
app.listen(port, () => {
    console.log(`프로젝트가 ${port}번 포트에서 시작합니다.`);
  });

  module.exports = app;