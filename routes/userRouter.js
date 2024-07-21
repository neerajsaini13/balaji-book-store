const express = require("express");
const router = express.Router();
const { signupController, loginController } = require("../controllers/UserController");
const { SignupValidate } = require("../middlewares/SingupValidate");
const { wrapAsync } = require("../utils/wrapAsync");
const { loginValidate } = require("../middlewares/loginValidate");
const { checkUserAuth } = require("../middlewares/userAuth");
const User = require("../models/User");
const multer = require('multer')
const { storage } = require("../config/cloudConfig")
const upload = multer({ storage })


router.post("/sign-up", SignupValidate, wrapAsync(signupController))

router.post("/login", loginValidate, wrapAsync(loginController));

router.get("/get-user-info", checkUserAuth, wrapAsync(async (req, res) => {
    let user = await User.findById(req.user._id)

    if (!user.avatar.url) {
        return res.status(200).json({ data: req.user })
    } else {
        let originalImageUrl = user.avatar.url;
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/c_fit,h_60,w_60/c_auto,g_auto,h_60,w_60/")
        return res.status(200).json({ data: req.user, originalImageUrl })
    }

}))


router.put("/update-user", checkUserAuth, upload.single('avatar'), wrapAsync(async (req, res) => {

    let { username, email, address } = req.body;
    let user = await User.findByIdAndUpdate(req.user._id, req.body);

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;

        user.avatar = { url, filename };
        await user.save()
    }

    return res.status(200).json({ message: "Profile updated successfully..." })
}))



module.exports = router