const mongoose = require("mongoose");

const MONGOOSE_URL = "mongodb://localhost:27017/Airbnb_database";

async function ConnectToMongoDB() {
  try {
    await mongoose.connect(MONGOOSE_URL);
  } catch (error) {
    console.log("error; ", error);
  }
}

// use this require and module.export syntax only if using type:commonjs and if possible use extension .mjs instead of .js in this case....
module.exports = { ConnectToMongoDB };