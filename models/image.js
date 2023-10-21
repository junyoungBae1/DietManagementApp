const mongoose = require('mongoose');

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
    }
},{timestamps: true});

module.exports = mongoose.model("Image",imageSchema);