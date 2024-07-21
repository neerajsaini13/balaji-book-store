const express = require("express");
const { wrapAsync } = require("../utils/wrapAsync");
const User = require("../models/User");
const { checkUserAuth } = require("../middlewares/userAuth");
const Book = require("../models/Book");
const router = express.Router();




router.get("/get-all-books", wrapAsync(async (req, res) => {
    const allbooks = await Book.find({}).sort({ createdAt: -1 })
    res.status(200).json({ message: "Get All Books", data: allbooks })
}))




// get recently books
router.get("/get-recent-books", wrapAsync(async (req, res) => {
    const allbooks = await Book.find({}).sort({ createdAt: -1 }).limit(4);
    res.status(200).json({ message: "Get Recently Books", data: allbooks })
}))



// get indivisual book 
router.get("/get-book/:bookid", wrapAsync(async (req, res) => {
    const book = await Book.findById(req.params.bookid);
    res.status(200).json({ message: "Get indivisual Book", data: book })
}))



router.post("/add-book", checkUserAuth, wrapAsync(async (req, res) => {
    // console.log(req.body);
    let { url, title, author, price, description, language } = req.body;
    let user = await User.findById(req.user._id);
    if (user.role !== "admin") {
        return res.status(400).json({ message: "You are not having access to created book" })
    }
    let book = new Book({ url, title, author, price, description, language });
    await book.save()
    res.status(201).json({ message: "Book Created Successfully..." })
}));




// update book 
router.put("/update-book/:bookid", checkUserAuth, wrapAsync(async (req, res) => {
    const { bookid } = req.params;
    const user = await User.findById(req.user._id);
    if (user.role != "admin") {
        return res.status(400).json({ message: "You are not having access to update book" })
    }
    await Book.findByIdAndUpdate(bookid, req.body)
    res.status(201).json({ message: "Book Updated Successfully..." })
}));




// delete book 
router.delete("/delete-book/:bookid", checkUserAuth, wrapAsync(async (req, res) => {
    const { bookid } = req.params;
    const user = await User.findById(req.user._id);
    if (user.role != "admin") {
        return res.status(400).json({ message: "You are not having access to update book" })
    }
    await Book.findByIdAndDelete(bookid)
    res.status(201).json({ message: "Book Deleted Successfully..." })
}))


module.exports = router