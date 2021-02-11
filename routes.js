var express = require("express");
const router = express.Router();

const dashboard = require('./controllers/dashboard.js')

router.get("/", dashboard.index);

module.exports = router;