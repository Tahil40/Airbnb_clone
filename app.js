const express = require("express");
const app = express();
const port = 8080;
const { ConnectToMongoDB } = require("./mongoose");
const listingSchema = require("./models/listing");

// connecting to Database....
ConnectToMongoDB()
  .then(() => {
    console.log("Successfully connected to MongoDB Database");
  })
  .catch((error) => {
    console.log(`Failed; ${error}`);
  });

// define get request
app.get("/", (req, res) => {
  res.send("Welcome to Airbnb");
});

app.get("/test_listing", async (req, res) => {
    let listingSampleTest = new listingSchema({
        title: "", 
        description: "",
        location: "", 
        price: 5000, 
        country: ""
    });
    await listingSampleTest.save();
    res.send("Data Successfully Saved to database");
});

app.listen(port, () => {
  console.log(`The App is Listining at Port: ${port}`);
});
