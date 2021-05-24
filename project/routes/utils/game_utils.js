const DButils = require("./DButils");
const axios = require("axios");

var generateGameID = 0;
var generateGameEventID = 0;


// will move to team utils later
async function isTeamExist(teamName) {
  const team = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/teams/season/${process.env.season_id}`,
    {
      params: {
        api_token: process.env.api_token,
      },
    }
  );
  team.data.forEach(element => {
    if (element.data.teamName == teamName) {
      return true;
    }
  });
  return false;
}

async function isRefereeExist(referee_id) {
  const referee = await DButils.execQuery(
    `select * from Referee where refereeID='${referee_id}'`
  )
  if (referee.length > 0){
    return true;
  } else {
    return false;
  }
}

async function createGame(data) {
  await DButils.execQuery(
    `insert into Game values (${generateGameID++},${data.time}, '${data.homeTeam}', '${data.awayTeam}',
      ${data.homeTeamGoals}, ${data.awayTeamGoals}, '${data.field}', ${data.referee})`
  );
}

async function updateGameScore(data) {
  await DButils.execQuery(
    `UPDATE Games SET homeTeamGoals=${data.homeTeamGoals}, awayTeamGoals=${data.awayTeamGoals} WHERE gameID=${data.gameID}`
  )
}

async function setReferee(data) {
  await DButils.execQuery(
    `UPDATE Games SET referee=${data.referee} WHERE gameID=${data.gameID}`
  )
}

async function addEventCale(data) {
  await DButils.execQuery(`insert into GameEvent values(${generateGameEventID++}, ${data.eventType}, ${data.gameMinute}, ${data.gameID}, ${data.playerID})`);
}

async function gameDetails(gameID) {
  const game = await DButils.execQuery(`select * from Games where gameID=${gameID}`);
  return game;
}

exports.isTeamExist = isTeamExist;
exports.createGame = createGame;
exports.gameDetails = gameDetails;
exports.updateGameScore = updateGameScore;
exports.setReferee = setReferee;
exports.isRefereeExist = isRefereeExist;
exports.generateGameID = generateGameID;
exports.addEventCale = addEventCale;
