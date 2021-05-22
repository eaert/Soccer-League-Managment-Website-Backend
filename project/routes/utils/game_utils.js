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

  async function getGame(game_id) {
    return await DButils.execQuery(`select * from Games WHERE gameID='${game_id}'`)
  }

  async function addGame(data) {
    await DButils.execQuery(
      `insert into Game values ('${generateGameID++}',${data.time}, ${data.homeTeam}, ${data.awayTeam},
       ${data.homeTeamGoals}, ${data.awayTeamGoals}, ${data.field}, ${data.referee})`
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

  // will move the referee utils later
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

  async function isGameExist(game_id) {
    const game = await DButils.execQuery(
      `select * from Games where gameID='${game_id}'`
    )
    if (game.length > 0){
      return true;
    } else {
      return false;
    }
  }

  async function addGameEvent(data) {
    await DButils.execQuery(
      `insert into GameEvent values ('${generateGameEventID++}',${data.eventType}, ${data.gameMinute}, ${data.gameID},
       ${data.playerID})`
    );
  }

  exports.isTeamExist = isTeamExist;
  exports.getGame = getGame;
  exports.addGame = addGame;
  exports.updateGameScore = updateGameScore;
  exports.setReferee = setReferee;
  exports.isRefereeExist = isRefereeExist;
  exports.isGameExist = isGameExist;
  exports.addGameEvent = addGameEvent;
