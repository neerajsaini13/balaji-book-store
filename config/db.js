const mongoose = require("mongoose");

module.exports.dbconnection = async (MONGO_URL) => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connection Success");
    } catch (error) {
        console.log(error);
    }
}