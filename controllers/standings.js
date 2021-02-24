"use strict";

const logger = require("../utils/logger");
const axios = require('axios');
const auth_token = process.env.X_AUTH_TOKEN;
const formatter = require('../utils/formatter');

const standings = {
    async index(req, res, next) {
        //Getting league standings from HTTP GET request using axios
        await axios.get(`https://api.football-data.org/v2/competitions/PL/standings`,{
            headers: {
                "X-Auth-Token": auth_token
            }
        })
        .then((response) => {
            //Empty standings array which will contain data for populating table
            let standings = [];
            let standingsData = response.data.standings[0].table;
            //Looping through the standings data received
            for (let x = 0; x < standingsData.length; x++) {
                //Formatting name of team
                let teamName = formatter.formatName(standingsData[x].team.name);
                //Creating array from form string
                let form = standingsData[x].form.split(",");
                //Creating object with data for populating row in standings table
                let standingsTeam = {
                    position: x+1,
                    teamName: teamName,
                    playedGames: standingsData[x].playedGames,
                    wins: standingsData[x].won,
                    draws: standingsData[x].draw,
                    lost: standingsData[x].lost,
                    goalsFor: standingsData[x].goalsFor,
                    goalsAgainst: standingsData[x].goalsAgainst,
                    goalDifference: standingsData[x].goalDifference,
                    points: standingsData[x].points,
                    form: form
                }
                //Pushing created object to standings array
                standings.push(standingsTeam);
            }
            //Creating object with data to be rendered in view
            const viewData = {
                standings: standings,
            }
            //Rendering standings view with viewData object
            res.render("standings", viewData)
        })
        .catch((error) => {
            console.log(error);
        }); 
    }
}

module.exports = standings;