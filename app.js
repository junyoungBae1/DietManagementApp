const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
const flash =  require("connect-flash");

var cookieParser = require('cookie-parser');
var logger = require('morgan');

const passport = require("passport");
const passportConfig = require("./utils/passport");

var userRouter = require("./routes/user");

app.use(express.urlencoded({ extended: false}));
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




//로그인(JWT)
app.use(passport.initialize());
app.use(flash());
passportConfig();

app.use('/user',userRouter);



//웹 화면 실행
  app.get("/", (req, res) => {
    res.end("HELLO!!","utf-8");
  });
app.listen(port, () => {
    console.log(`프로젝트가 ${port}번 포트에서 시작합니다.`);
  });

  module.exports = app;