const express = require("express");
const router = express.Router();
const searchController = require("../controllers/search");

//음식 검색하기
router.post('/foods',searchController.foodsearch);

//리포트
router.post('/report',searchController.report);

module.exports = router;