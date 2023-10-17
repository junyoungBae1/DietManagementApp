const Recipe = require('../models/recipe');
const Ingredient = require('../models/ingredient');
const ingredient = require('../models/ingredient');

const weakFire = 0.001
const midFire = 0.003
const strongFire = 0.006

module.exports.calculateEmission = async (req, res, next) => {
    try {
      const foodname = req.body.foodname; // Assuming the food name is sent in the request body
      const recipe = await Recipe.findOne({ foodname });
    console.log(recipe)
      if (!recipe) {
        throw new Error(`No recipe found for ${foodname}`);
      }
      let transport = 0;
      let totalEmission = 0;
      //생산과정
      for (let ingredient of recipe.ingredients) {
        const ingredientDoc = await Ingredient.findOne({ ingredient: ingredient.name });
        console.log(ingredientDoc)
        if (!ingredientDoc) {
          throw new Error(`Ingredient ${ingredient.name} not found`);
        }

        // Add to total emission (emission per gram * grams used)
        totalEmission += (ingredientDoc.emission * ingredient.grams / 1000);
        //수송과정 식재료 중량(kg) * 수송거리(ton.km) * 탄소성적표지(육상수송(트럭))배출계수
        transport += ingredient.grams/1000 * 0.18 * 0.249
      }
        console.log("수송",transport)
      //
       console.log(recipe.cookingTime)

      console.log(totalEmission)
       //res.json({ totalEmission }); // Send the result back as JSON
      res.send("<script> alert('계산완료.'); location.href='/calculator';</script>");
    } catch (error) {
      console.error(error);
      
       // Pass the error to the next middleware function
       // This could be your error-handling middleware that you'd define elsewhere in your app
       next(error);
    }
  }