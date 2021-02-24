"use strict";

const logger = require("../utils/logger");
const axios = require('axios');
const auth_token = process.env.X_AUTH_TOKEN;
const formatter = require('../utils/formatter');

const topScorers = {
    async index(req, res, next) {
        //Getting top scorers from HTTP GET request using axios
        await axios.get(`https://api.football-data.org/v2/competitions/PL/scorers`,{
            headers: {
                "X-Auth-Token": auth_token
            }
        })
        .then((response) => {
            //Empty topScorers array which will contain data for populating table
            let topScorers = []
            let scorersData = response.data.scorers;
            //Looping through the top scorers data received
            for (let x = 0; x < scorersData.length; x++) {
                //Formatting name of team
                let teamName = formatter.formatName(scorersData[x].team.name);
                //Creating object with data for populating row in top scorers table
                let player = {
                    position: x+1,
                    playerName: scorersData[x].player.name,
                    nationality: scorersData[x].player.nationality,
                    teamName: teamName,
                    goals: scorersData[x].numberOfGoals,
                }
                //Pushing created object to top scorers array
                topScorers.push(player);
            }
            //Creating object with data to be rendered in view
            const viewData = {
                topScorers: topScorers,
            }
            //Rendering top-scorers view with viewData object
            res.render("top-scorers", viewData);
        })
        .catch((error) => {
            console.log(error);
        }); 
    }
}

module.exports = topScorers;