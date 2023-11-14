const mongoose = require('mongoose');

const DateEmissionSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    Dessert: {
        type: Number,
        default: 0
    },
    Breakfast: {
        type: Number,
        default: 0
    },
    Lunch: {
        type: Number,
        default: 0
    },
    Dinner: {
        type: Number,
        default: 0
    },
    totalEmission:{
        type: Number,
        default: 0
    },
    score:{
        type: Number,
        default: 0
    }
}, { _id : false });

const InfoSchema = new mongoose.Schema({
    email: {
        type : String,
        required : true,
        unique: true,
    },
    dates: [DateEmissionSchema]

});

module.exports = mongoose.model("Info", InfoSchema);