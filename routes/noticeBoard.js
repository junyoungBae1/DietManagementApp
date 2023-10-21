var express = require('express');
const router = express.Router();
const noticeController = require("../controllers/noticeBoard");
//게시판 글 작성 C
router.post('/create',noticeController.create);
//게시판 보기 R
router.get('/read',noticeController.read);
//게시판 글 수정 U
router.post('/update',noticeController.update)
//게시판 글 삭제 D
routes.post('/delete',noticeController.delete)


