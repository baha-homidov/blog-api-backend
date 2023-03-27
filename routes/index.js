var express = require('express');
var router = express.Router();


// Require controller modules
const article_controller = require("../controllers/articleController");


/* GET home page. */
router.get('/', article_controller.article_list_get);

module.exports = router;
