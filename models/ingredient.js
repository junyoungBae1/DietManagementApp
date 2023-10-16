const { required } = require('joi');
const mongoose = require('mongoose');

const ingredientsSchema = new mongoose.Schema({
    ingredient: {
        type : String,
        required : true,
        unique: true,
    },
    emission: {
        type : Number,
        required : true,
    },

  });

  module.exports = mongoose.model("Ingredient", ingredientsSchema);