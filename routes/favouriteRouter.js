const express = require("express");
const router = express.Router();

const { checkUserAuth } = require("../middlewares/userAuth");
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/User");


// add book to favourite 
router.put("/add-book-to-favourite/:bookid", checkUserAuth, wrapAsync(async (req, res) => {
    let { bookid } = req.params;
    let user = await User.findById(req.user._id);
    const isBookFavourite = user.favourites.includes(bookid);
    if (isBookFavourite) {
        return res.status(200).json({ status: "success", message: "Book is already favorite." })
    }
    await User.findByIdAndUpdate(req.user._id, { $push: { favourites: bookid } })
    return res.status(200).json({ status: "success", message: "book added in favourite." })
}))





// delete book to favourite
router.put("/delete-book-to-favourite/:bookid", checkUserAuth, wrapAsync(async (req, res) => {
    let { bookid } = req.params;
    const user = await User.findById(req.user._id);

    const isBookFavourite = user.favourites.includes(bookid);
    if (isBookFavourite) {
        await User.findByIdAndUpdate(req.user._id, { $pull: { favourites: bookid } });
    }
    return res.status(200).json({ status: "success", message: "Book removed favorite." })
}));







// get favourites book of perticular user 
router.get("/get-favourite-books", checkUserAuth, wrapAsync(async (req, res) => {
    const user = await User.findById(req.user._id).populate("favourites");
    const userFavouriteBooks = user.favourites;
    return res.status(200).json({ status: "success", data: userFavouriteBooks });

}))

module.exports = router;