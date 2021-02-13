var express = require("express");
const router = express.Router();
const dashboard = require('./controllers/dashboard');

router.get("/", dashboard.index);

module.exports = router;