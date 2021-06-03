const { default: axios } = require("axios");
var express = require("express");
var router = express.Router();
var search_utils = require("./utils/search_utils");

router.post("", async (req, res, next) => {
    try {
        // await initLeague();
        // await initGameLogs();
        const results = await search_utils.searchByName(req.body.freeSearch, req.body.precise);
        res.send(results);
    } catch(error) {
        next(error);
    }
})

// async function initLeague() {
//     const teams = await axios.get(
//         `${process.env.api_domain}/teams/season/${process.env.season_id}`,
//         {
//           params: {
//             api_token: process.env.api_token,
//           },
//         }
//       );
//     var promises = [];
//     var DB = require("./utils/DButils");
//     (teams.data.data).forEach(team => {
//         promises.push(DB.execQuery(`insert into Teams values(${team.id}, ${1}, '${team.name}')`));
//     });
//     await Promise.all(promises);
// }

const events = ['YellowCard', 'RedCard', 'Offside', 'Foul', 'Injury', 'Substitution', 'Goal']

async function initGameLogs() {
    var DB = require("./utils/DButils");
    const DButils = require("./utils/DButils");
    const gameIDs = await DButils.execQuery(`select * from Games where date='2021-1-1'`);
    var promises = [];
    for (let j=0; j<gameIDs.length;j++) {
        for (let i=0;i<4;i++){
            var holder = gameIDs[j].homeTeam;
            var homeTeamID = await DButils.execQuery(`select teamID from Teams where teamName='${holder}'`);
            homeTeamID = homeTeamID[0].teamID;
            holder = gameIDs[j].awayTeam;
            var awayTeamID = await DButils.execQuery(`select teamID from Teams where teamName='${holder}'`);
            awayTeamID = awayTeamID[0].teamID;
            var event = Math.floor(Math.random() * 7); 
            event = events[event];
            var homeTeamGoals = 0;
            var awayTeamGoals = 0;
            var gameMinute = Math.floor(Math.random() * 93);
            var playersHome = await axios.get(
                `${process.env.api_domain}/teams/${homeTeamID}?include=squad.player`,
                {
                    params: {
                        api_token: process.env.api_token,
                    },
                    }
            );
            var playersAway = await axios.get(
                `${process.env.api_domain}/teams/${awayTeamID}?include=squad.player`,
                {
                    params: {
                        api_token: process.env.api_token,
                    },
                    }
            );
            holder = []
            playersHome.data.data.squad.data.forEach(element => {
                holder.push(element.player_id);
            });
            playersHome = holder;
            holder = []
            playersAway.data.data.squad.data.forEach(element => {
                holder.push(element.player_id);
            });
            playersAway = holder;
            var team = Math.floor(Math.random() * 2);
            if (team = 0) {
                if (event === 'Goal') {
                    homeTeamGoals++;
                }
                var player = Math.floor(Math.random() * playersHome.length);
                player = playersHome[player];
            } else {
                if (event === 'Goal') {
                    awayTeamGoals++;
                }
                var player = Math.floor(Math.random() * playersAway.length);
                player = playersAway[player];
            }
            promises.push(
                DButils.execQuery(`insert into GameEvent values('${event}', ${gameMinute}, ${gameIDs[j].gameID}, ${player})`)
            );
            promises.push(
                DButils.execQuery(`UPDATE Games SET homeTeamGoals=${homeTeamGoals}, awayTeamGoals=${awayTeamGoals} WHERE gameID=${gameIDs[j].gameID}`)
            );
        }
    };
}

module.exports = router;
