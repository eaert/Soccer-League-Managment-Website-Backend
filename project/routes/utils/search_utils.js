const axios = require("axios");
const DButils = require("./DButils");
const players_utils = require("./players_utils");
const teams_utils = require("./teams_utils");
const filter = require("./filter");

async function searchByName(freeSearch, precise) {
    var search_results = {players: [], teams: []}
    if (precise === "player" || !precise) {
        const players = await axios.get(
            `${process.env.api_domain}/players/search/${freeSearch}`,
            {
              params: {
                include: 'team',
                api_token: process.env.api_token,
              },
            }
          );
        search_results.players = await filter.filterPlayers(players.data.data);
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
        search_results.teams = await filter.filterTeams(teams.data.data);
    }
    return search_results;
}

exports.searchByName = searchByName;