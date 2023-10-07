const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

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


//그냥 화면 잘 뜨는지 보려고
  app.get("/", (req, res) => {
    res.end("HELLO!!","utf-8");
  });
app.listen(port, () => {
    console.log(`프로젝트가 ${port}번 포트에서 시작합니다.`);
  });

  module.exports = app;