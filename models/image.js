const mongoose = require('mongoose');

const foodnameSchema = new mongoose.Schema({
  foodname: {
    type: String,
    required: true
  },
  totalEmission: {
    type: Number,
    required: true
  },
  score:{
    type: Number,
    require: true,
  }
}, { _id : false });

const imageSchema = new mongoose.Schema({
    email: {
        type : String,
        required: true,
    },
    img: {
      data: Buffer,
      contentType: String
        },
    etc:{
        type: String,
        required: true,
    },
    foodnames: [foodnameSchema],
    date : {
        type: String,
        required: true,
},

});

module.exports = mongoose.model("Image",imageSchema);