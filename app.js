const express = require("express");
const app = express();
const port = 8080;
const { ConnectToMongoDB } = require("./util/mongoose");
const listingSchema = require("./models/listing");
const { InitDB } = require("./util/initDB");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extends: true}));

// connecting to Database....
ConnectToMongoDB()
  .then(() => {
    console.log("Successfully connected to MongoDB Database");
  })
  .catch((error) => {
    console.log(`Failed; ${error}`);
  });

// initialize database....
InitDB();

// define get request
app.get("/", (req, res) => {
  res.send("Welcome to Airbnb");
});

app.get("/get-listings", async (req, res) => {
  try {
    const response_data = await listingSchema.find({});
    // console.log(response_data);
    // res.send(response_data);
    res.render("listings/index.ejs", { response_data });
  } catch (error) {
    console.log("Error; ", error);
  }
});

// if you don't use async and await then user .then() and catch() to read response from the server....
// app.get("/get-listings", (req, res) => {
//   listingSchema
//     .find({})
//     .then((response_data) => {
//       // console.log(response_data);
//       // res.send(response_data);
//       res.render("index.ejs", {response_data});
//     })
//     .catch((error) => {
//       console.log("error; ", error);
//     });
// });

app.get("/test_listing", async (req, res) => {
  // let listingSampleTest = new listingSchema({
  //     title: "",
  //     description: "",
  //     location: "",
  //     price: 5000,
  //     country: ""
  // });
  // await listingSampleTest.save();
  // res.send("Data Successfully Saved to database");
});

app.get("/listing/:id", async (req, res) => {
  const { id } = req.params; 
  let find_listing_by_id = await listingSchema.findById(id);
  // res.send(find_listing_by_id);
  res.render("listings/show_listing.ejs", {find_listing_by_id});
});

app.listen(port, () => {
  console.log(`The App is Listining at Port: ${port}`);
});
