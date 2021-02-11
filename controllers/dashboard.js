"use strict";

const logger = require("../utils/logger");

const dashboard = {
    index(request, response) {
        logger.info("Rendering Dashboard");
        response.render('dashboard')
    }
}

module.exports = dashboard;