const axios = require("axios");
const DButils = require("./DButils");
const players_utils = require("./players_utils");
const teams_utils = require("./teams_utils");

async function searchByName(freeSearch, precise) {
    var search_results = {players: {}, teams: {}}
    if (precise === "player" || !precise) {
        const players = await axios.get(
            `${process.env.api_domain}/players/search/${freeSearch}`,
            {
              params: {
                api_token: process.env.api_token,
              },
            }
          );
        search_results.players = await players_utils.getPlayersInfo(players);
    }
    if (precise === "team" || !precise) {
        const teams = await axios.get(
            `${process.env.api_domain}/teams/search/${freeSearch}`,
            {
              params: {
                api_token: process.env.api_token,
              },
            }
          );
        search_results.players = await teams_utils.teamDetails(teams);
    }
    return search_results;
}

exports.searchByName = searchByName;