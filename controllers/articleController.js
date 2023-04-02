const Comment = require("../models/comment");
const Article = require("../models/article");
const { body, validationResult } = require("express-validator");
const async = require("async");
const { isObjectIdOrHexString } = require("mongoose");

// GET list of all articles
exports.article_list_get = (req, res) => {
  Article.find().exec(function (err, list_articles) {
    if (err) {
      return next(err);
    }

    // Sucessful, so respond
    return res.json(list_articles);
  });
};

// GET an article (with its comments)
exports.article_get = (req, res, next) => {
  // validate if request.body.id is a valid Mongo ObjectId
  if (!isObjectIdOrHexString(req.params.id)) {
    return res.status(400).json({ error: "Invalid article ID" });
  }

  async.parallel(
    {
      article(callback) {
        Article.findById(req.params.id).exec(callback);
      },
      comments(callback) {
        Comment.find({ article: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      } else if (results.article) {
        // Successful so respond
        return res.json(results);
      } else {
        return res.status(404).json({
          error: `document with ID ${req.params.id} doesn't exist`,
        });
      }
    }
  );
};

// POST a new article
exports.article_post = [
  // Validate and sanitize data
  body("text", "Text must not be empty").trim().isLength({ min: 1 }).escape(),
  body("title", "Title must not be empty").trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization
  (req, res, next) => {
    const errors = validationResult(req);

    // if there are errors in request body
    // set an error status and respond
    if (!errors.isEmpty()) {
      console.log("error");
      return res.status(400).json(errors.mapped());
    }

    const article = new Article({
      title: req.body.title,
      text: req.body.text,
      timestamp: new Date(),
      modified: false,
    });

    // Data from request body is valid. Save article
    article.save((err) => {
      if (err) {
        return next(err);
      }
      // Sucessfull
     return  res.json(article);
    });
  },
];

// PUT (UPDATE) an article
exports.article_update = [
  body("text", "Text must not be empy").trim().isLength({ min: 1 }).escape(),
  body("title", "Title must not be empy").trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    // if there are errors in request body
    // set an error status and respond
    if (!errors.isEmpty()) {
      console.log("error");
      return res.status(400).json(errors.mapped());
    }

    // validate if request.params.id is a valid Mongo ObjectId
    if (!isObjectIdOrHexString(req.params.id)) {
      return res.status(400).json({ error: "Invalid article ID" });
    }

    Article.findOneAndUpdate(
      { _id: req.params.id },
      {
        $addToSet: {},
        $set: {
          title: req.body.title,
          text: req.body.text,
          modified: true,
          modifiedDate: new Date(),
        },
      },
      { new: true, upsert: false },
      (err, doc) => {
        if (err) {
          return next(err);
        } else if (doc) {
          return res.json(doc);
        } else {
          return res.status(404).json({
            error: `document with ID ${req.params.id} doesn't exist`,
          });
        }
      }
    );
  },
];

// DELETE an article
exports.article_delete = (req, res, next) => {
  if (!isObjectIdOrHexString(req.params.id)) {
    return res.status(204).json({ response: "Success" });
  }

  async.parallel(
    {
      article(callback) {
        Article.deleteOne({ _id: req.params.id }).exec(callback);
      },
      comments(callback) {
        Comment.deleteMany({ article: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      // Seccessful so return
      return res.json({ response: "success" });
    }
  );
};
