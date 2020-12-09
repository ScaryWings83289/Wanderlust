const Tour = require("../models/tours");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  var perPage = 4;
  var pageQuery = parseInt(req.query.page);
  var pageNumber = pageQuery ? pageQuery : 1;
  var noMatch = null;
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    await Tour.find({ title: regex })
      .skip(perPage * pageNumber - perPage)
      .limit(perPage)
      .exec(function (err, allTours) {
        Tour.countDocuments({ title: regex }).exec(function (err, count) {
          if (err) {
            console.log(err);
            res.redirect("back");
          } else {
            if (allTours.length < 1) {
              noMatch = "No tours matches that query, please try again.";
            }
            res.render("tours/index", {
              tours: allTours,
              current: pageNumber,
              pages: Math.ceil(count / perPage),
              search: req.query.search,
              noMatch: noMatch,
            });
          }
        });
      });
  } else {
    // get all campgrounds from DB
    await Tour.find({})
      .skip(perPage * pageNumber - perPage)
      .limit(perPage)
      .exec(function (err, allTours) {
        Tour.countDocuments().exec(function (err, count) {
          if (err) {
            console.log(err);
          } else {
            res.render("tours/index", {
              tours: allTours,
              current: pageNumber,
              pages: Math.ceil(count / perPage),
              noMatch: noMatch,
              search: false,
            });
          }
        });
      });
  }
};

module.exports.renderNewForm = (req, res) => {
  res.render("tours/new");
};

module.exports.createTour = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.tour.location,
      limit: 1,
    })
    .send();
  const tour = new Tour(req.body.tour);
  tour.geometry = geoData.body.features[0].geometry;
  tour.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  tour.author = req.user._id;
  await tour.save();
  req.flash("success", "Successfully made a new tour!");
  res.redirect(`/tours/${tour._id}`);
};

module.exports.showTour = async (req, res) => {
  const tour = await Tour.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!tour) {
    req.flash("error", "Cannot find that tour!");
    return res.redirect("/tours");
  }
  res.render("tours/show", { tour });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const tour = await Tour.findById(id);
  if (!tour) {
    req.flash("error", "Cannot find that tour!");
    return res.redirect("/tours");
  }
  res.render("tours/edit", { tour });
};

module.exports.updateTour = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const tour = await Tour.findByIdAndUpdate(id, { ...req.body.tour });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  tour.images.push(...imgs);
  await tour.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await tour.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated tour!");
  res.redirect(`/tours/${tour._id}`);
};

module.exports.deleteTour = async (req, res) => {
  const { id } = req.params;
  await Tour.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted tour");
  res.redirect("/tours");
};

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
