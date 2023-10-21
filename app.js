const express = require("express");
const app = express();
const ejs = require('ejs');
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
const flash =  require("connect-flash");

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const passport = require("passport");
const passportConfig = require("./utils/passport");

var userRouter = require("./routes/user");
var imageRouter = require("./routes/image");
var scoreRouter = require("./routes/score");
var addRecipeRouter = require("./routes/addRecipe");
var calculatorRouter = require("./routes/calculator");
var noticeRouter = require("./routes/noticeBoard");

app.set('view engine','ejs');
app.set('views','./views');

app.use(express.urlencoded({ extended: true})); //false에서 true로 바꿈
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
//사진 저장
app.use('/image',imageRouter);
//점수
app.use('/score',scoreRouter);
//recipe저장, 재료저장
app.use('/addRecipe',addRecipeRouter);
//탄소계산기
app.use('/calculator',calculatorRouter)
//게시물
app.use('/noticeBoard',noticeRouter);

//웹 화면 실행
  app.get("/", (req, res) => {

    console.log("start")

    res.render('app');
  });
  app.get('/login', (req,res) => {
    res.render('login')
  })
  app.get('/register', (req,res) => {
    res.render('register')
  })
  app.get('/score', (req,res) => {
    res.render('score')
  })
  app.get('/addrecipe', (req,res) => {
    res.render('addrecipe')
  })
  app.get('/addingredient', (req,res) => {
    res.render('addingredient')
  })
  app.get('/calculator', (req,res) => {
    res.render('calculator')
  })
app.listen(port, () => {
    console.log(`프로젝트가 ${port}번 포트에서 시작합니다.`);
  });

  module.exports = app;