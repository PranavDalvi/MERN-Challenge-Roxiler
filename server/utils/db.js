const mongoose = require("mongoose");

const URI = process.env.MONGODB_URI;

const connectDb = async () => {
    try{
        await mongoose.connect(URI);
        console.log("Connection successful to DB");
    } catch (error){
        console.error(`DB Error: ${error}`);
        process.exit(0);
    }
};

module.exports = connectDb;