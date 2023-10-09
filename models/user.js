const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    id: {
        type : String,
        default : function() {
            return new mongoose.Types.ObjectId().toHexString();
        }
    },
    username: {
        type : String,
        required : true,
    },
    email: {
        type : String,
        required : true,
        unique : true,
    },
    phonenum: {
        type : String,
        required :true,
    },
  });

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);