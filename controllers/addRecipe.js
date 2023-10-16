const Recipe = require('../models/recipe');

module.exports.addRecipe = async (req, res, next) => {
    try {
        const foodname = req.body.foodname;
        const ingredients = req.body.ingredients;
        const cookingTime = req.body.cookingTime;
        // Create new recipe
        const newRecipe = new Recipe({
          foodname,
          ingredients,
          cookingTime
        });
    
        // Save to database
        await newRecipe.save();
    
        res.send("<script> alert('DB SAVE'); location.href='/addRecipe';</script>");
      } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the recipe.' });
      }
};