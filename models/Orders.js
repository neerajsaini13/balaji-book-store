const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    book: {
        type: mongoose.Types.ObjectId,
        ref: "Book"
    },
    status: {
        type: String,
        default: "order placed",
        enum: ["order placed", "out for delivery", "delivered", "canceled"]
    },

}, { timestamps: true });


// model 
module.exports = mongoose.model("Order", orderSchema);