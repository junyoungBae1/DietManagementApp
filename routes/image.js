const express = require("express");
const router = express.Router();
const imageController = require("../controllers/image");
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({storage:storage});
const catchAsync = require("../utils/catchAsync");

//image O  db저장
router.post('/upload',upload.single('img'),catchAsync(imageController.saveimage))
//image X  db저장
router.post('/upload2',imageController.saveimage)
//image 탐색
router.post('/find', catchAsync(imageController.findimage));

//image 삭제
router.post('/delete',imageController.deleteimage);


module.exports = router;