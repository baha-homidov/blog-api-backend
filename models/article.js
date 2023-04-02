const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, required: true },
  modified: {
    type: Boolean,
    required: true,
  },
  modifiedDate: { type: Date },
});

// Virtual for Article's URL
ArticleSchema.virtual("url").get(function () {
  // Not an arrow function as we'll need the this object
  // TODO: put actual URL after setting the routes
  return "/";
});

module.exports = mongoose.model("Article", ArticleSchema);
