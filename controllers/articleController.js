const Comment = require("../models/comment");
const Article = require("../models/article");
const { body, validationResult } = require("express-validator");

// GET list of all articles
exports.article_list_get = (req, res) => {
  Article.find().exec(function (err, list_articles) {
    if (err) {
      return next(err);
    }

    // Sucessful, so respond
    res.json(list_articles);

  });
};

// GET an article (with its comments)
exports.article_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Article GET");
};

// POST a new article
exports.article_post = [
  // Validate and sanitize data
  body("text", "Text must not be empy").trim().isLength({ min: 1 }).escape(),
  body("title", "Title must not be empy").trim().isLength({ min: 1 }).escape(),

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
    });

    // Data from request body is valid. Save article
    article.save((err) => {
      if (err) {
        return next(err);
      }
      // Sucessfull
      res.json(article);
    });
  },
];

// PUT (UPDATE) an article
exports.article_update = (req, res) => {
  res.send("NOT IMPLEMENTED: Article UPDATE");
};

// DELETE an article
exports.article_delete = (req, res) => {
  res.send("NOT IMPLEMENTED: Article DELETE");
};
