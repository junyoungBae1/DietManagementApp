const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  grams: {
    type: Number,
    required: true
  }
}, { _id : false });

const FireSchema = new mongoose.Schema({
    level :{
        type: Number,
        required :true,
    },
    min :{
        type: Number,
        required :true,
    },
}, { _id : false })
const recipeSchema = new mongoose.Schema({
  id: {
      type : String,
      default : function() {
          return new mongoose.Types.ObjectId().toHexString();
      },
      unique: true,
  },
  foodname : {
      type: String,
      required: true,
      unique : true
  },
  ingredients: [IngredientSchema],
      
  cookingTime : [FireSchema]
}); 

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;