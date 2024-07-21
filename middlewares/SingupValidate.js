const Joi = require("joi");
const ExpressError = require("../utils/ExpressError");

const SingupSchemaValidate = Joi.object({
    username: Joi.string().required().trim(),
    email: Joi.string().required(),
    password: Joi.string().required().min(6).max(15),
    address: Joi.string().required().trim(),
});


module.exports.SignupValidate = (req, res, next) => {
    let { error } = SingupSchemaValidate.validate(req.body)
    if (error) {
        let errmsg = error.details.map((el) => el.message)
        throw new ExpressError(400, errmsg)
    } else {
        next()
    }
}