"use strict";

const logger = require("../utils/logger");
const axios = require('axios');
const auth_token = process.env.X_AUTH_TOKEN;

const standings = {
    async index(req, res, next) {

        //Getting league standing
        let standings = [];
        await axios.get(`https://api.football-data.org/v2/competitions/PL/standings`,{
            headers: {
                "X-Auth-Token": auth_token
            }
        })
        .then((response) => {
            let standingsData = response.data.standings[0].table;
            for (let x = 0; x < standingsData.length; x++) {
                let teamName = standingsData[x].team.name;
                if (teamName.includes(" FC")) {
                    teamName = teamName.replace(" FC", "");
                }
                if (teamName == "Brighton & Hove Albion") {
                    teamName = "Brighton";
                }
                let form = standingsData[x].form.split(",");
                let standingsTeam = {
                    position: standingsData[x].position,
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
                standings.push(standingsTeam);
            }
            const viewData = {
                standings: standings,
            }
            res.render("standings", viewData)
        })
        .catch((error) => {
            console.log(error);
        }); 

    }
}

module.exports = standings;