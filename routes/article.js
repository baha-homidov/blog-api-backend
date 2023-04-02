var express = require("express");
var router = express.Router();

// Require controller modules
const article_controller = require("../controllers/articleController");
const comment_controller = require("../controllers/commentController");

/* POST article. */
router.post("/", article_controller.article_post);

/* GET article. */
router.get("/:id", article_controller.article_get);

/* GET article list. */
router.get("/", article_controller.article_list_get);

/* PUT article. */
router.put("/:id", article_controller.article_update);

/* DELETE article. */
router.delete("/:id", article_controller.article_delete);

// POST comment
router.post("/:id/comment/", comment_controller.comment_post);

// DELETE comment
router.delete("/:id/comment/:id", comment_controller.comment_delete);

module.exports = router;
