"use strict";

const logger = require("../utils/logger");
const axios = require('axios');
const auth_token = process.env.X_AUTH_TOKEN;

const fixtures = {
    async index(req, res, next) {
        let currentGameweek;
        let teamCrests = [];

        //Getting current gameweek and team crests
        await axios.get(`https://api.football-data.org/v2/competitions/PL/teams`,{
            headers: {
                "X-Auth-Token": auth_token
            }
        })
        .then((response) => {
            let competitionData = response.data;
            currentGameweek = competitionData.season.currentMatchday;
            for (let x = 0; x < competitionData.teams.length; x++) {
                teamCrests.push(competitionData.teams[x].crestUrl);
            }
        })
        .catch((error) => {
            console.log(error);
        }); 

        //Getting fixtures for current gameweek
        await axios.get(`https://api.football-data.org/v2/competitions/PL/matches/?matchday=${currentGameweek}`,{
            headers: {
                "X-Auth-Token": auth_token
            }
        })
        .then((response) => {
            let fixtures = [];
            let fixtureData = [];
            fixtureData = response.data.matches;
            for (let x = 0; x < fixtureData.length; x++) {
                let result = null;

                //Checking if match has kicked off yet
                if (fixtureData[x].score.winner == null) {
                    let date = new Date(fixtureData[x].utcDate);
                    //Formatting date
                    result = ("0" + date.getDate()).slice(-2) + "-"
                            + (("0" + (date.getMonth() + 1)).slice(-2)) + "-"
                            + date.getFullYear() + " "
                            + ("0" + date.getHours()).slice(-2) + ":"
                            + ("0" + date.getMinutes()).slice(-2);
                } else {
                    //Displaying match score
                    result = fixtureData[x].score.fullTime.homeTeam
                            + " - "
                            + fixtureData[x].score.fullTime.awayTeam
                }

                //Removing "FC" from club names
                let homeTeam = fixtureData[x].homeTeam.name;
                if (homeTeam.includes(" FC")) {
                    homeTeam = homeTeam.replace(" FC", "");
                }
                if (homeTeam == "Brighton & Hove Albion") {
                    homeTeam = "Brighton";
                }
                let awayTeam = fixtureData[x].awayTeam.name;
                if (awayTeam.includes(" FC")) {
                    awayTeam = awayTeam.replace(" FC", "");
                }
                if (awayTeam == "Brighton & Hove Albion") {
                    awayTeam = "Brighton";
                }

                //Creating object containing fixture data
                let fixture = {
                    result: result,
                    homeTeam: homeTeam,
                    awayTeam: awayTeam,
                }

                //Adding fixture object to fixtures array
                fixtures.push(fixture);
            }

            //Creating object containing data to be rendered
            const viewData = {
                gameweek: currentGameweek,
                fixtureList: fixtures,
            }
            res.render("fixtures", viewData);
        })
        .catch((error) => {
            console.log(error);
        });
    }
}

module.exports = fixtures;