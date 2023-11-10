const express = require("express");
const router = express.Router();
const searchController = require("../controllers/search");

//음식 검색하기
router.post('/foods',searchController.foodsearch);

module.exports = router;