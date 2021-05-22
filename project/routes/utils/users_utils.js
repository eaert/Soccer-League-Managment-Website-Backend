const DButils = require("./DButils");

var favo_id = 0;

async function markPlayerAsFavorite(username, player_id) {
  favo_id = favo_id + 1
  await DButils.execQuery(
    `insert into FavoritePlayers values ('${favo_id}','${username}',${player_id},'player')`
  );
}

async function getFavoritePlayers(username) {
  const player_ids = await DButils.execQuery(
    `select player_id from FavoritePlayers where username='${username}'`
  );
  return player_ids;
}

async function getFavoriteTeams(username) {
  const player_ids = await DButils.execQuery(
    `select team_id from FavoriteTeams where username='${username}'`
  );
  return player_ids;
}

async function getFavoriteGames(username) {
  const game_ids = await DButils.execQuery(
    `select game_id from UserFavorite where username='${username}'`
  );
  return player_ids;
}

async function markTeamAsFavorite(username, team_id) {
  favo_id = favo_id + 1
  await DButils.execQuery(
    `insert into UserFavorite values ('${favo_id}','${username}',${team_id},'team')`
  );
}

async function markGameAsFavorite(username, game_id) {
  favo_id = favo_id + 1
  await DButils.execQuery(
    `insert into UserFavorite values ('${favo_id}','${username}',${game_id},'game')`
  );
}

exports.markPlayerAsFavorite = markPlayerAsFavorite;
exports.markTeamAsFavorite = markTeamAsFavorite;
exports.markGameAsFavorite = markGameAsFavorite;
exports.getFavoritePlayers = getFavoritePlayers;
exports.getFavoriteTeams = getFavoriteTeams;
exports.getFavoriteGames = getFavoriteGames;
