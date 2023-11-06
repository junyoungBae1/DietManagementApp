var express = require('express');
const router = express.Router();
const noticeController = require("../controllers/noticeBoard");
//게시판 글 작성 C
router.post('/create',noticeController.create);
//게시판 보기 R
router.get('/read',noticeController.read);
//게시판 특정 조회
router.post('/getBoard',noticeController.getBoard);
//게시판 글 수정 U
router.post('/update',noticeController.update);
//게시판 글 삭제 D
router.post('/delete',noticeController.delete);
//게시판 검색
router.post('/serach',noticeController.search);
//댓글 작성
router.post('/createComment',noticeController.createComment);
//댓글 삭제
router.post('/deleteComment',noticeController.deleteComment);
//댓글 수정
router.post('/updateComment',noticeController.updateComment);


module.exports = router;