const sample_data = require("./sample_data");
const listingSchema = require("../models/listing");

const InitDB = async () => {
  try {
    await listingSchema.deleteMany({});
    await listingSchema.insertMany(sample_data.data);
    console.log("Data Successfully Initialized");
  } catch (error) {
    console.log("Error; ", error);
  }
};

module.exports = { InitDB };
