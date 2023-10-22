const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  noticeToken: {
    type : String,
    unique : true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  writer: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

// 게시물 모델 생성
const Notice = mongoose.model('Notice', noticeSchema);

module.exports = Notice;