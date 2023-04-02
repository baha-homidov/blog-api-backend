const Comment = require("../models/comment");
const Article = require("../models/article");

const { body, validationResult, check } = require("express-validator");
const async = require("async");
const { isObjectIdOrHexString } = require("mongoose");
const article = require("../models/article");

// POST a comment
exports.comment_post = [
  // Validate and sanitize data
  check("title")
    .isLength({ min: 1 })
    .withMessage("Title must not be empty")
    .isLength({ max: 100 })
    .withMessage("Title must bo shorter than 100 charachters"),
  check("author")
    .isLength({ min: 1 })
    .withMessage("Title must not be empty")
    .isLength({ max: 50 })
    .withMessage("Title must bo shorter than 100 charachters"),
  check("text")
    .isLength({ min: 1 })
    .withMessage("Title must not be empty")
    .isLength({ max: 250 })
    .withMessage("Title must bo shorter than 250 charachters"),
  // Process request after validation and sanitization
  (req, res, next) => {
    const errors = validationResult(req);
    // if there are errors in request body
    // set an error status and respond
    if (!errors.isEmpty()) {
      console.log("error");
      return res.status(400).json(errors.mapped());
    }

    const comment = new Comment({
      title: req.body.title,
      author: req.body.author,
      text: req.body.text,
      timestamp: new Date(),
      article: req.params.id,
    });

    // validate if request.body.id is a valid Mongo ObjectId
    if (!isObjectIdOrHexString(req.params.id)) {
      res.status(400).json({ error: "Invalid article ID" });
    }

    Article.exists({ _id: req.params.id }, function (err, docExists) {
      if (err) {
        res.send(err);
      } else if (!docExists) {
        console.log("NOT FOUND");
        return res
          .status(404)
          .json({ error: `Document with ID ${req.params.id} doesn't exist` });
      } else {
        // Data from request body is valid and article does exits. Save comment
        comment.save((err) => {
          if (err) {
            return next(err);
          }
          // Successful
          res.json(comment);
        });
      }
    });
  },
];

// DELETE a comment
exports.comment_delete = (req, res) => {
  res.send("NOT IMPLEMENTED: Comment DELETE");
};
