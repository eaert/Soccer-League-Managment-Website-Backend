const DButils = require("./DButils");
const axios = require("axios");
const league_utils = require("./league_utils");

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
  try {
    const referee = await DButils.execQuery(
      `select * from Referee where refereeID='${referee_id}'`
    )
    return true;
  } catch (error) {
    return false;
  }
}

async function createGame(data) {
  await DButils.execQuery(
    `insert into Games values ('${data.time}', '${data.hours}', '${data.homeTeam}', '${data.awayTeam}',
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
  await DButils.execQuery(`insert into GameEvent values('${data.eventType}', ${data.gameMinute}, ${data.gameID}, ${data.playerID})`);
}

async function gameDetails(gameID) {
  try {
    const game = await DButils.execQuery(`select * from Games where gameID=${gameID}`);
    return game;
  } catch (error) {
    return undefined;
  }
}

async function getGamesByTeamName(teamName) {
  try{
    const games = await DButils.execQuery(`select * from Games where homeTeam='${teamName}' or awayTeam='${teamName}'`);
    const stageNum = await DButils.execQuery(`select roundNum from Leagues where leagueID=1`);
    let seasonDetails = {
      year: '2021',
      month: '6',
      day: '6'
    }
    for (let i=0;i<stageNum[0].roundNum-1;i++) {
      seasonDetails = league_utils.dateManager(seasonDetails);
    }
    var splitGames = {
      prev: [],
      next: []
    }
    games.forEach(game => {
      var date = (game.date).split('/')
      if (parseInt(date[1]) <= parseInt(seasonDetails.month)) {
        if (parseInt(date[2]) < parseInt(seasonDetails.day)){
          splitGames.prev.push(game);
        } else {
          splitGames.next.push(game);
        }
      } else {
        splitGames.next.push(game);
      }
    });
    return splitGames;
  } catch (error) {
    return [];
  }
}

async function getGameLogsByGameID(gameIDs) {
  var promises = [];
  gameIDs.forEach(gameID => {
    promises.push(DButils.execQuery(`select * from GameEvent where gameID=${gameID}`))
  });
  var gameLogArray = await Promise.all(promises);
  return gameLogArray;
}

async function getGames(date) {
  const games = await DButils.execQuery(`select * from Games where date='${date}'`);
  return games;
}

exports.isTeamExist = isTeamExist;
exports.createGame = createGame;
exports.gameDetails = gameDetails;
exports.updateGameScore = updateGameScore;
exports.setReferee = setReferee;
exports.isRefereeExist = isRefereeExist;
exports.addEventCale = addEventCale;
exports.getGamesByTeamName = getGamesByTeamName;
exports.getGameLogsByGameID = getGameLogsByGameID;
exports.getGames = getGames;
