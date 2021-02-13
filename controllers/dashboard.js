"use strict";

const logger = require("../utils/logger");
const axios = require('axios');

const dashboard = {
    async index(req, res, next) {

        let currentGameweek;
        let teamCrests = [];

        //Getting current gameweek and team crests
        await axios.get(`https://api.football-data.org/v2/competitions/PL/teams`,{
            headers: {
                "X-Auth-Token": "ef1ee02e332f436b9321f666e0dd9ae2"
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

        //Getting league standing
        let standings = [];
        await axios.get(`https://api.football-data.org/v2/competitions/PL/standings`,{
            headers: {
                "X-Auth-Token": "ef1ee02e332f436b9321f666e0dd9ae2"
            }
        })
        .then((response) => {
            let standingsData = response.data.standings[0].table;
            for (let x = 0; x < standingsData.length; x++) {
                let teamName = standingsData[x].team.name;
                if (teamName.includes(" FC")) {
                    teamName = teamName.replace(" FC", "");
                }
                let standingsTeam = {
                    position: standingsData[x].position,
                    crestUrl: standingsData[x].team.crestUrl,
                    teamName: teamName,
                    playedGames: standingsData[x].playedGames,
                    wins: standingsData[x].won,
                    draws: standingsData[x].draw,
                    lost: standingsData[x].lost,
                    goalDifference: standingsData[x].goalDifference,
                    points: standingsData[x].points,
                }
                standings.push(standingsTeam);
            }
            console.log(standings);
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
                let awayTeam = fixtureData[x].awayTeam.name;
                if (awayTeam.includes(" FC")) {
                    awayTeam = awayTeam.replace(" FC", "");
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
                teamCrests: teamCrests,
                gameweek: currentGameweek,
                fixtureList: fixtures,
                standings: standings
            }
            res.render("dashboard", viewData);
        })
        .catch((error) => {
            console.log(error);
        }); 
         
    }
}

module.exports = dashboard;