const { checkUserAuth } = require("../middlewares/userAuth");
const Orders = require("../models/Orders");
const User = require("../models/User");
const { wrapAsync } = require("../utils/wrapAsync");

const router = require("express").Router()


router.post("/place-order", checkUserAuth, wrapAsync(async (req, res) => {
    const { order } = req.body;
    if (order.length > 0) {
        for (const orderData of order) {
            // console.log(orderData);
            const newOrder = Orders({ user: req.user._id, book: orderData._id });
            const orderdataFromDB = await newOrder.save();

            // saving order in user model 
            await User.findByIdAndUpdate(req.user._id, { $push: { orders: orderdataFromDB._id } })

            // clearing cart 
            await User.findByIdAndUpdate(req.user._id, { $pull: { cart: orderData._id } })
        }
        return res.status(201).json({ message: "Order Placed Successfull." })
    } else {
        return res.status(400).json({ message: "Order Not Exist" })
    }
}));




// get order history of particular user 
router.get("/get-order-history", checkUserAuth, wrapAsync(async (req, res) => {
    const userData = await User.findById(req.user._id).populate({
        path: "orders",
        populate: { path: "book" }
    })
    const orderData = userData.orders.reverse();
    return res.status(200).json({ message: "Get", data: orderData })
}))



// get all orders== admin 
router.get("/get-all-orders", checkUserAuth, wrapAsync(async (req, res) => {
    const userData = await Orders.find({}).populate({ path: "user" }).populate({ path: "book" }).sort({ createdAt: -1 });
    return res.status(200).json({ message: "Get", data: userData })

}));



// update status 
router.put("/update-status/:id", checkUserAuth, wrapAsync(async (req, res) => {
    const { id } = req.params;
    // console.log(req.body);
    let userData = await Orders.findByIdAndUpdate(id, { status: req.body.status });
    return res.status(200).json({ message: "Status Update Successfully", data: userData })
}))

module.exports = router;