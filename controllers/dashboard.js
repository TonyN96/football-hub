"use strict";

const logger = require("../utils/logger");
const axios = require('axios');

const dashboard = {
    index(req, res, next) {
        axios.get(`https://api.football-data.org/v2/competitions/PL/matches`,{
            headers: {
                "X-Auth-Token": "ef1ee02e332f436b9321f666e0dd9ae2"
            }
        })
        .then((response) => {
            let fixtures = [];
            let fixtureData = [];
            fixtureData = response.data;
            let currentGameweek = fixtureData.matches[0].season.currentMatchday;
            let currentGameweekMatches = []
            for (let x = 0; x < fixtureData.matches.length; x++) {
                if (fixtureData.matches[x].matchday == currentGameweek) {
                    currentGameweekMatches.push(fixtureData.matches[x]);
                }
            }
            for (let x = 0; x < currentGameweekMatches.length; x++) {
                let result = null;
                if (currentGameweekMatches[x].score.winner == null) {
                    let date = new Date(currentGameweekMatches[x].utcDate);
                    result = ("0" + date.getDate()).slice(-2) + "-"
                            + (("0" + (date.getMonth() + 1)).slice(-2)) + "-"
                            + date.getFullYear() + " "
                            + ("0" + date.getHours()).slice(-2) + ":"
                            + ("0" + date.getMinutes()).slice(-2);
                } else {
                    result = currentGameweekMatches[x].score.fullTime.homeTeam
                            + " - "
                            + currentGameweekMatches[x].score.fullTime.awayTeam
                }
                let fixture = {
                    result: result,
                    homeTeam: currentGameweekMatches[x].homeTeam.name,
                    awayTeam: currentGameweekMatches[x].awayTeam.name,
                }
                fixtures.push(fixture);
            }
            const viewData = {
                gameweek: currentGameweek,
                fixtureList: fixtures
            }
            res.render("dashboard", viewData);
        })
        .catch((error) => {
            console.log(error);
        });    
    }
}

module.exports = dashboard;