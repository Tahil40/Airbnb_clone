const express = require("express");
const router = express.Router();
const listingSchema = require("../models/listing");
const wrapAsync = require("../util/wrapAsync");
const ExpressError = require("../util/ExpressError");
const { ListingSchema, ReviewsSchema } = require("../util/ValidationSchema");
const reviews = require("../models/reviews");
const { isLoggedIn } = require("../middleware.js");

const ValidateListing = (req, res, next) => {
  const result = ListingSchema.validate(req.body);
  if (result.error) {
    let errorMessage = result.error.details
      .map((element) => element.message)
      .join(",");
    console.log(errorMessage);
    throw new ExpressError(400, result.error);
  } else {
    next();
  }
};

const ValidateReviews = (req, res, next) => {
  const result = ReviewsSchema.validate(req.body);
  if (result.error) {
    let errorMessage = result.error.details
      .map((element) => element.message)
      .join(",");
    console.log(errorMessage);
    throw new ExpressError(400, result.error);
  } else {
    next();
  }
};

router.get("/get-listings", async (req, res) => {
  try {
    const response_data = await listingSchema.find({});
    // console.log(response_data);
    // res.send(response_data);
    res.render("listings/index.ejs", { response_data });
  } catch (error) {
    console.log("Error; ", error);
  }
});

router.get("/listing/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    // let find_listing_by_id = await listingSchema.findById(id);
    let find_listing_by_id = await listingSchema
      .findById(id)
      .populate("reviews");

    if (!find_listing_by_id) {
      // show flash here
      req.flash("error", "listing not found");
      res.redirect("/listings");
    }
    // res.send(find_listing_by_id);
    res.render("listings/show_listing.ejs", { find_listing_by_id });
  } catch (error) {
    next(error);
  }
});
 
router.get("/listings/new", isLoggedIn, (req, res) => {
  // console.log(req.user);
  // if(!req.isAuthenticated()){
  //   req.flash("error", "You must be logged in!");
  //   return res.redirect("/login");
  // }; 
  res.render("listings/new.ejs");
});

router.post(
  "/listings",
  ValidateListing,
  wrapAsync(async (req, res) => {
    // it can also be apply on individual fields like -> req.body.field_name....
    if (req.body === "undefined") {
      throw new ExpressError(400, "Send valid data for listing");
    }
    let result = ListingSchema.validate(req.body);
    if (result.error) {
      throw new ExpressError(400, result.error);
    }
    console.log(result);
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
      location: location,
    });
    await SavelistingToDatabase.save();

    // show flash here
    req.flash("success", "new listing created");

    res.redirect("/get-listings");
  }),
);

router.get("/EditListing/:id/edit", async (req, res) => {
  const { id } = req.params;
  let find_listing_by_id = await listingSchema.findById(id);

  res.render("listings/edit_listing", { find_listing_by_id });
});

router.put("/edit_listing/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, image, price, location, country } = req.body;
  await listingSchema.findByIdAndUpdate(id, {
    title: title,
    description: description,
    image: image,
    price: price,
    country: country,
    location: location,
  });

  res.redirect(`/EditListing/${id}/edit`);
});

router.delete("/DeleteListing/:id/delete", async (req, res) => {
  const { id } = req.params;
  const delete_response = await listingSchema.findByIdAndDelete(id);
  console.log("Listing hass been successfully deleted; ", delete_response);

  res.redirect("/get-listings");
});

router.post(
  "/listings/:id/reviews",
  ValidateReviews,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    let find_listing_by_id = await listingSchema.findById(id);
    const { review_rating, comment } = req.body;
    let review = new reviews({
      comment: comment,
      rating: review_rating,
    });
    find_listing_by_id.reviews.push(review);

    await review.save();
    await find_listing_by_id.save();

    console.log("Review Successfully Saved");
    res.send("Review Successfully Saved");
    // res.render("listings/show_listing.ejs", { find_listing_by_id });
  }),
);

router.delete(
  "/listings/:listing_id/reviews/:review_id",
  wrapAsync(async (req, res) => {
    const { listing_id, review_id } = req.body;
    await listingSchema.findByIdAndUpdate(id, {
      $pull: { reviews: review_id },
    });
    await reviews.findByIdAndDelete(review_id);

    res.redirect(`/listings/${listing_id}`);
  }),
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    return next(err);
  });
  req.flash("success", "You are successfully logged out!");
  res.redirect("/listings");
});

module.exports = router;