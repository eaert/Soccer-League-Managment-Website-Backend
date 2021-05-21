const DButils = require("./DButils");
const axios = require("axios");

async function isTeamExist(teamName) {
    const team = await axios.get(
      `https://soccer.sportmonks.com/api/v2.0/teams/search/${teamName}`,
      {
        params: {
          api_token: process.env.api_token,
        },
      }
    );
    return team.data.data.length == 0
  }
  exports.getLeagueDetails = getLeagueDetails;
