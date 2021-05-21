const DButils = require("./DButils");

async function markPlayerAsFavorite(user_id, player_id) {
  await DButils.execQuery(
    `insert into FavoritePlayers values ('${user_id}',${player_id},'player')`
  );
}

async function getFavoritePlayers(user_id) {
  const player_ids = await DButils.execQuery(
    `select player_id from FavoritePlayers where user_id='${user_id}'`
  );
  return player_ids;
}

async function getFavoriteTeams(user_id) {
  const player_ids = await DButils.execQuery(
    `select team_id from FavoriteTeams where user_id='${user_id}'`
  );
  return player_ids;
}

async function getFavoriteGames(user_id) {
  const game_ids = await DButils.execQuery(
    `select game_id from FavoriteGames where user_id='${user_id}'`
  );
  return player_ids;
}

async function markTeamAsFavorite(user_id, team_id) {
  await DButils.execQuery(
    `insert into FavoriteTeams values ('${user_id}',${team_id},'team')`
  );
}

async function markGameAsFavorite(user_id, game_id) {
  await DButils.execQuery(
    `insert into FavoriteGames values ('${user_id}',${game_id},'game')`
  );
}

exports.markPlayerAsFavorite = markPlayerAsFavorite;
exports.markTeamAsFavorite = markTeamAsFavorite;
exports.markGameAsFavorite = markGameAsFavorite;
exports.getFavoritePlayers = getFavoritePlayers;
exports.getFavoriteTeams = getFavoriteTeams;
exports.getFavoriteGames = getFavoriteGames;
