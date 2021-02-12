var express = require("express");
const router = express.Router();
const axios = require('axios');

router.get("/", (req, res, next) => {
    axios.get(`https://api.football-data.org/v2/competitions/PL/matches?matchday=24`,{
        headers: {
            "X-Auth-Token": "ef1ee02e332f436b9321f666e0dd9ae2"
        }
    })
    .then((response) => {
        let fixtures = [];
        let fixtureData = [];
        fixtureData = response.data;
        for (let x = 0; x < fixtureData.matches.length; x++) {
            let fixture = {
                date: fixtureData.matches[x].utcDate,
                homeTeam: fixtureData.matches[x].homeTeam.name,
                awayTeam: fixtureData.matches[x].awayTeam.name,
            }
            fixtures.push(fixture);
        }
        const viewData = {
            fixtureList: fixtures
        }
        res.render("dashboard", viewData);
    })
    .catch((error) => {
        console.log(error);
    });
});

module.exports = router;