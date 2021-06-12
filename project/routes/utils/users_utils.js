const axios = require("axios");
const DButils = require("./DButils");

async function markPlayerAsFavorite(username, player_id) {
  const exists = await DButils.execQuery(
    `select 1 from UserFavorite where username='${username}' and targetID=${player_id} and type='player'`
  );
  if (exists[0]) {
    throw { status: 405, message: 'target already been favorited'};
  } else {
    await DButils.execQuery(
      `insert into UserFavorite values('${username}',${player_id},'player')`
    );
  }
}

async function markTeamAsFavorite(username, team_id) {
  const exists = await DButils.execQuery(
    `select 1 from UserFavorite where username='${username}' and targetID=${team_id} and type='team'`
  );
  if (exists[0]) {
    throw { status: 405, message: 'target already been favorited'};
  } else {
    await DButils.execQuery(
      `insert into UserFavorite values('${username}',${team_id},'team')`
    );
  }
}

async function markGameAsFavorite(username, game_id) {
  const exists = await DButils.execQuery(
    `select 1 from UserFavorite where username='${username}' and targetID=${game_id} and type='game'`
  );
  if (exists[0]) {
    throw { status: 405, message: 'target already been favorited'};
  } else {
    await DButils.execQuery(
      `insert into UserFavorite values('${username}',${game_id},'game')`
    );
  }
}

async function getFavoritePlayers(username) {
  const player_ids = await DButils.execQuery(
    `select targetID from UserFavorite where username='${username}' and type='player'`
  );
  let promises = [];
  player_ids.map((player) =>
    promises.push(
      axios.get(`${process.env.api_domain}/players/${player.targetID}`, {
        params: {
          include: 'team',
          api_token: process.env.api_token,
        },
      })
    )
  );
  let players_info = await Promise.all(promises);
  return players_info;
}

async function getFavoriteTeams(username) {
  const team_ids = await DButils.execQuery(
    `select targetID from UserFavorite where username='${username}' and type='team'`
  );
  let promises = [];
  team_ids.map((team) =>
    promises.push(
      axios.get(`${process.env.api_domain}/teams/${team.targetID}`, {
        params: {
          api_token: process.env.api_token,
        },
      })
    )
  );
  let teams_info = await Promise.all(promises);
  return teams_info;
}

async function getFavoriteGames(username) {
  const game_ids = await DButils.execQuery(
    `select targetID from UserFavorite where username='${username}' and type='game'`
  );
  let promises = [];
  game_ids.map((game) =>
    promises.push(
      DButils.execQuery(`select * from Games WHERE gameID='${game.targetID}'`) // TODO need to check if the query is right
    )
  );
  let games_info = await Promise.all(promises);
  return games_info;
}

async function deleteFavo(username, data) {
  await DButils.execQuery(`delete from UserFavorite where username='${username}' and targetID=${data.targetID} and type='${data.type}'`);
}

exports.markPlayerAsFavorite = markPlayerAsFavorite;
exports.markTeamAsFavorite = markTeamAsFavorite;
exports.markGameAsFavorite = markGameAsFavorite;
exports.getFavoritePlayers = getFavoritePlayers;
exports.getFavoriteTeams = getFavoriteTeams;
exports.getFavoriteGames = getFavoriteGames;
exports.deleteFavo = deleteFavo;
