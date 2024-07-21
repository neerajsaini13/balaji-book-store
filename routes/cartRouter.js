const express = require("express");
const { checkUserAuth } = require("../middlewares/userAuth");
const User = require("../models/User");
const { wrapAsync } = require("../utils/wrapAsync");
const router = express.Router();

router.put("/add-to-cart/:bookid", checkUserAuth, wrapAsync(async (req, res) => {
    let { bookid } = req.params;
    let user = await User.findById(req.user._id);
    const isBookCart = user.cart.includes(bookid);
    if (isBookCart) {
        return res.status(200).json({ status: "success", message: "book is already in cart" })
    };
    await User.findByIdAndUpdate(user._id, { $push: { cart: bookid } })
    return res.status(200).json({ status: "success", message: "book added in cart" })
}));




router.put("/remove-to-cart/:bookid", checkUserAuth, wrapAsync(async (req, res) => {
    let { bookid } = req.params;
    let user = await User.findById(req.user._id);

    const isBookCart = user.cart.includes(bookid);
    if (isBookCart) {
        await User.findByIdAndUpdate(user._id, { $pull: { cart: bookid } })
        return res.status(200).json({ status: "success", message: "book deleted in cart" })
    };
}));




// get cart of perticular user 
router.get("/get-all-cart", checkUserAuth, wrapAsync(async (req, res) => {
    let user = await User.findById(req.user._id).populate("cart");
    let userCart = user.cart.reverse();
    return res.status(200).json({ status: "success", data: userCart })
}));




module.exports = router