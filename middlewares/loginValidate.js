const Joi = require("joi");
const ExpressError = require("../utils/ExpressError");

const loginSchemaValidate = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required().min(6).max(15),
});


module.exports.loginValidate = (req, res, next) => {
    let { error } = loginSchemaValidate.validate(req.body)
    if (error) {
        let errmsg = error.details.map((el) => el.message)
        throw new ExpressError(400, errmsg)
    } else {
        next()
    }
}