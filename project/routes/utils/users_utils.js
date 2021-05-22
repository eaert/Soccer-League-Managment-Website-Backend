const DButils = require("./DButils");

var favo_id = 0;

async function markPlayerAsFavorite(username, player_id) {
  await DButils.execQuery(
    `insert into FavoritePlayers values ('${favo_id++}','${username}',${player_id},'player')`
  );
}

async function markTeamAsFavorite(username, team_id) {
  await DButils.execQuery(
    `insert into UserFavorite values ('${favo_id++}','${username}',${team_id},'team')`
  );
}

async function markGameAsFavorite(username, game_id) {
  await DButils.execQuery(
    `insert into UserFavorite values ('${favo_id++}','${username}',${game_id},'game')`
  );
}

async function getFavoritePlayers(username) {
  const player_ids = await DButils.execQuery(
    `select targetID from UserFavorite where username='${username}' and type='player'`
  );
  let promises = [];
  players_ids_list.map((id) =>
    promises.push(
      axios.get(`${process.env.api_domain}/players/${id}`, {
        params: {
          api_token: process.env.api_token,
        },
      })
    )
  );
  let players_info = await Promise.all(promises);
  // return extractRelevantPlayerData(players_info);
  return players_info;
}

async function getFavoriteTeams(username) {
  const team_ids = await DButils.execQuery(
    `select team_id from FavoriteTeams where username='${username}'`
  );
  let promises = [];
  team_ids.map((id) =>
    promises.push(
      axios.get(`${process.env.api_domain}/players/${id}`, {
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
    `select game_id from UserFavorite where username='${username}'`
  );
  let promises = [];
  game_ids.map((id) =>
    promises.push(
      DButils.execQuery("select * from Games, Referees WHERE Games.referee=Referees.refereeID") // TODO need to check if the query is right
    )
  );
  let games_info = await Promise.all(promises);
  return games_info;
}

exports.markPlayerAsFavorite = markPlayerAsFavorite;
exports.markTeamAsFavorite = markTeamAsFavorite;
exports.markGameAsFavorite = markGameAsFavorite;
exports.getFavoritePlayers = getFavoritePlayers;
exports.getFavoriteTeams = getFavoriteTeams;
exports.getFavoriteGames = getFavoriteGames;
