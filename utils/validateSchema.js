//JOI로 Schema 확인
const Joi = require("joi");

const userSchema=Joi.object({
    email: Joi.string().min(1).max(30).required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
    username: Joi.string().min(2).max(10).required(),
});

module.exports = userSchema;