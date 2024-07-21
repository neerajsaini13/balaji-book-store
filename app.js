require('dotenv').config()

const express = require("express");
const { dbconnection } = require('./config/db');
const app = express();
const port = process.env.PORT || 3002;
const MONGO_URL = process.env.MONGO_URL
const cors = require("cors")
const userRouter = require("./routes/userRouter");
const bookRouter = require("./routes/bookRouter");
const favouriteRouter = require("./routes/favouriteRouter");
const cartRouter = require("./routes/cartRouter");
const orderRouter = require("./routes/orderRouter");
const ExpressError = require('./utils/ExpressError');


// db connection 
dbconnection(MONGO_URL);


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())

app.get("/err", (req, res) => {
    a = a
    throw new ExpressError(400, "ERROR")
})

app.use("/user", userRouter)
app.use("/book", bookRouter)
app.use("/favourite", favouriteRouter)
app.use("/cart", cartRouter)
app.use("/order", orderRouter)






// Error handling middleware 
app.use((err, req, res, next) => {
    console.log(err);
    let { statuscode = 500, message = "Something Went Wrong" } = err;
    res.status(statuscode).json({ message: message, sucess: false })
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})