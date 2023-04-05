const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  author: { type: String, required: true, maxLength: 50 },
  text: { type: String, required: true, maxLength: 250 },
  timestamp: { type: Date, required: true },
  article: [{ type: Schema.Types.ObjectId, ref: "Article" }],
});

module.exports = mongoose.model("Comment", CommentSchema);
