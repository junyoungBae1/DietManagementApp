var express = require('express');
const router = express.Router();
const AddRecipe = require("../controllers/addRecipe");

router.post('/addRecipe', AddRecipe.addRecipe);

router.post('/addIngredient', AddRecipe.addIngredient);

module.exports = router;