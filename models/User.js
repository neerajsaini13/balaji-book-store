const mongoose = require("mongoose");

// schema 
const userschema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    avatar: {
        url: String,
        filename: String,
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    cart: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Book"
        }
    ],
    favourites: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Book"
        }
    ],
    orders: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Order"
        }
    ]
}, { timestamps: true });


// model 
module.exports = mongoose.model("User", userschema);