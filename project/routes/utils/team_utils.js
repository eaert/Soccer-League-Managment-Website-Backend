const axios = require("axios");
const DButils = require("./DButils");

async function teamDetails(teamName) {
    const team = await axios.get(
        `${process.env.api_domain}/teams/search/${teamName}`,
        {
          params: {
            api_token: process.env.api_token,
          },
        }
      );
    return {
        teamID: team.data.data.id,
        teamname: team.data.data.name,
        shortname: team.data.data.short_code,
        founded: team.data.data.founded,
        logo: team.data.data.logo_path
    };
}

async function teamSchedule(teamName) {
    const games = await DButils.execQuery(`select * from Games where homeTeam=${teamName} or awayTeam=${teamName}`);
    return games;
}

exports.teamDetails = teamDetails;
exports.teamSchedule = teamSchedule;