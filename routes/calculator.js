var express = require('express');
const router = express.Router();
const calController = require("../controllers/calculator");

router.post('/calculateEmission', calController.calculateEmission);

module.exports = router;