"use strict";

const logger = require("../utils/logger");
const axios = require('axios');
const auth_token = process.env.X_AUTH_TOKEN;
const formatter = require('../utils/formatter');

const results = {
    async index(req, res, next) {
        //Getting current gameweek from HTTP GET request using axios
        let currentGameweek;
        await axios.get(`https://api.football-data.org/v2/competitions/PL/teams`,{
            headers: {
                "X-Auth-Token": auth_token
            }
        })
        .then((response) => {
            //Getting current gameweek from returned data
            let competitionData = response.data;
            currentGameweek = competitionData.season.currentMatchday;
        })
        .catch((error) => {
            console.log(error);
        }); 

        //Getting fixtures for current gameweek from HTTP GET request using axios
        await axios.get(`https://api.football-data.org/v2/competitions/PL/matches/?matchday=${currentGameweek}`,{
            headers: {
                "X-Auth-Token": auth_token
            }
        })
        .then((response) => {
            //Empty fixtures array which will contain data for populating table
            let fixtures = [];
            let fixtureData = response.data.matches;
            for (let x = 0; x < fixtureData.length; x++) {
                /* matchStatus variable which contains kick off time if match has not been played yet
                or final score if match has been played */
                let matchStatus;
                //Checking if match has kicked off yet
                if (fixtureData[x].score.winner == null) {
                    let date = new Date(fixtureData[x].utcDate);
                    //Formatting date
                    matchStatus = formatter.formatDate(date);
                } else {
                    //Displaying match score
                    matchStatus = fixtureData[x].score.fullTime.homeTeam
                            + " - "
                            + fixtureData[x].score.fullTime.awayTeam
                }
                //Formatting name of teams
                let homeTeam = formatter.formatName(fixtureData[x].homeTeam.name);
                let awayTeam = formatter.formatName(fixtureData[x].awayTeam.name);
                //Creating object containing fixture data
                let fixture = {
                    result: matchStatus,
                    homeTeam: homeTeam,
                    awayTeam: awayTeam,
                }
                //Pushing created object to fixtures array
                fixtures.push(fixture);
            }

            //Creating object with data to be rendered in view
            const viewData = {
                gameweek: currentGameweek,
                fixtureList: fixtures,
            }
            //Rendering results view with viewData object
            res.render("results", viewData);
        })
        .catch((error) => {
            console.log(error);
        });
    }
}

module.exports = results;