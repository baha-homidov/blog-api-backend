const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  comment: { type: String, required: true },
  author: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, required: true },
  article: [{type: Schema.Types.ObjectId, ref: "Article"}],
})


module.exports = mongoose.model("Comment", CommentSchema);