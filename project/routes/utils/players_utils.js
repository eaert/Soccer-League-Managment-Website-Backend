const axios = require("axios");
const DButils = require("./DButils");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
// const TEAM_ID = "85";

async function getPlayerIdsByTeam(teamID) {
  let player_ids_list = [];
  const team = await axios.get(`${api_domain}/teams/${teamID}`, {
    params: {
      include: "squad",
      api_token: process.env.api_token,
    },
  });
  team.data.data.squad.data.map((player) =>
    player_ids_list.push(player.player_id)
  );
  return player_ids_list;
}

async function getPlayersInfo(players_ids_list) {
  let promises = [];
  players_ids_list.map((id) =>
    promises.push(
      axios.get(`${api_domain}/players/${id}`, {
        params: {
          api_token: process.env.api_token,
          include: "team",
        },
      })
    )
  );
  let players_info = await Promise.all(promises);
  return extractRelevantPlayerData(players_info);
}

function extractRelevantPlayerData(players_info) {
  return players_info.map((player_info) => {
    const { player_id, firstname, lastname, image_path, position_id, nationality } = player_info.data.data;
    const { name } = player_info.data.data.team.data;
    return {
      playerID: player_id,
      firstname: firstname,
      lastname: lastname,
      image: image_path,
      position: position_id,
      nation: nationality,
      team_name: name,
    };
  });
}

async function getPlayersByTeam(team_id) {
  let player_ids_list = await getPlayerIdsByTeam(team_id);
  let players_info = await getPlayersInfo(player_ids_list);
  return players_info;
}

async function playerDetails(playerID) {
  const player = await axios.get(`https://soccer.sportmonks.com/api/v2.0/players/${playerID}`,
  {
      params: {
          include: "team",
          api_token: process.env.api_token,
      },
  });
  return {
      playerID: player.data.data.player_id,
      firstname: player.data.data.firstname,
      lastname: player.data.data.lastname,
      image: player.data.data.image_path,
      playerteam: player.data.data.team.data.name,
      position: player.data.data.position_id,
      nation: player.data.data.nationality,
      birthday: player.data.data.birthday,
      country: player.data.data.birthcountry,
      weight: player.data.data.weight,
      height: player.data.data.height
  };
}

exports.getPlayersByTeam = getPlayersByTeam;
exports.getPlayersInfo = getPlayersInfo;
exports.playerDetails = playerDetails;
exports.extractRelevantPlayerData = extractRelevantPlayerData;
