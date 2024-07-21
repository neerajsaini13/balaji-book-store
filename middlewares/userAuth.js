const Jwt = require("jsonwebtoken");
const User = require("../models/User");
const { wrapAsync } = require("../utils/wrapAsync");

module.exports.checkUserAuth = wrapAsync(async (req, res, next) => {
    let { authorization } = req.headers;
    const token = authorization && authorization.split(" ")[1];
    if (token == null) {
        return res.status(401).json({ message: "Unauthorized User " })
    }
    Jwt.verify(token, process.env.SECRET_KEY, async (err, user) => {
        if (err) {
            return res.status(203).json({ message: "Token expired, please sign in again." })
        }

        let getUser = await User.findById(user.authClaims[0].id).select("-password");
        if (getUser !== null) {
            req.user = getUser;
            next()
        } else {
            return res.status(500).json({ message: "user not found" })
        }
    })
})