var express = require("express");
const router = express.Router();
const standings = require('./controllers/standings');
const fixtures = require('./controllers/fixtures');

router.get("/", standings.index);
router.get("/fixtures", fixtures.index);

module.exports = router;