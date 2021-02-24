var express = require("express");
const router = express.Router();
const standings = require('./controllers/standings');
const results = require('./controllers/results');
const topScorers = require('./controllers/top-scorers');

router.get("/", standings.index);
router.get("/results", results.index);
router.get("/topScorers", topScorers.index);

module.exports = router;