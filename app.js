const express = require("express");
const app = express();
const port = 8080;
const { ConnectToMongoDB } = require("./util/mongoose");
const listingSchema = require("./models/listing");
const { InitDB } = require("./util/initDB");
const path = require("path");
const methodoverride = require("method-override");
const ejs_mate = require("ejs-mate");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extends: true }));
app.use(methodoverride("_method"));
app.engine("ejs", ejs_mate);
app.use(express.static(path.join(__dirname, "/public")));

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
  res.render("listings/show_listing.ejs", { find_listing_by_id });
});

app.get("/listings/new", async (req, res) => {
  res.render("listings/new.ejs");
});

app.post("/listings", async (req, res) => {
  // one way of accessing data from form....
  const { title, description, image, price, location, country } = req.body;
  // console.log(title, description, image, price, location, country);

  // second way of accessing data from form....
  // const form_data = req.body.listing_value;
  // console.log(form_data);
  // res.render("listings/new.ejs");

  let SavelistingToDatabase = new listingSchema({
    title: title,
    description: description,
    image: image,
    price: price,
    country: country,
    location: location
  });
  await SavelistingToDatabase.save();

  res.redirect("/get-listings");
});

app.get("/EditListing/:id/edit", async (req, res) => {
  const { id } = req.params;
  let find_listing_by_id = await listingSchema.findById(id);

  res.render("listings/edit_listing", { find_listing_by_id });
});

app.put("/edit_listing/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, image, price, location, country } = req.body;
  await listingSchema.findByIdAndUpdate(id, {
    title: title,
    description: description,
    image: image,
    price: price,
    country: country,
    location: location
  });

  res.redirect(`/EditListing/${id}/edit`);
});

app.delete("/DeleteListing/:id/delete", async (req, res) => {
  const { id } = req.params;
  const delete_response = await listingSchema.findByIdAndDelete(id);
  console.log("Listing hass been successfully deleted; ", delete_response);

  res.redirect("/get-listings");
});

app.listen(port, () => {
  console.log(`The App is Listining at Port: ${port}`);
});
