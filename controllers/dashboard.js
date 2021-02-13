"use strict";

const logger = require("../utils/logger");
const axios = require('axios');

const dashboard = {
    async index(req, res, next) {

        let currentGameweek;

        //Getting current gameweek
        await axios.get(`https://api.football-data.org/v2/competitions/PL/`,{
            headers: {
                "X-Auth-Token": "ef1ee02e332f436b9321f666e0dd9ae2"
            }
        })
        .then((response) => {
            let competitionData = response.data;
            currentGameweek = competitionData.currentSeason.currentMatchday;
        })
        .catch((error) => {
            console.log(error);
        }); 

        //Getting fixtures for current gameweek
        await axios.get(`https://api.football-data.org/v2/competitions/PL/matches/?matchday=${currentGameweek}`,{
            headers: {
                "X-Auth-Token": "ef1ee02e332f436b9321f666e0dd9ae2"
            }
        })
        .then((response) => {
            let fixtures = [];
            let fixtureData = [];
            fixtureData = response.data.matches;
            for (let x = 0; x < fixtureData.length; x++) {
                let result = null;
                if (fixtureData[x].score.winner == null) {
                    let date = new Date(fixtureData[x].utcDate);
                    result = ("0" + date.getDate()).slice(-2) + "-"
                            + (("0" + (date.getMonth() + 1)).slice(-2)) + "-"
                            + date.getFullYear() + " "
                            + ("0" + date.getHours()).slice(-2) + ":"
                            + ("0" + date.getMinutes()).slice(-2);
                } else {
                    result = fixtureData[x].score.fullTime.homeTeam
                            + " - "
                            + fixtureData[x].score.fullTime.awayTeam
                }
                let fixture = {
                    result: result,
                    homeTeam: fixtureData[x].homeTeam.name,
                    awayTeam: fixtureData[x].awayTeam.name,
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