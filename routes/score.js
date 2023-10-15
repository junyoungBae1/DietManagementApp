var express = require('express');
const router = express.Router();

const scoreController = require("../controllers/score");

router.post('/updateScore', scoreController.updateScore);

router.get('/getScore', scoreController.getScore);

module.exports = router;