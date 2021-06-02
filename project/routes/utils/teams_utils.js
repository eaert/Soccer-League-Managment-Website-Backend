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
      team.data.data = team.data.data[0];
    return extractRelevantTeamData([team]);
}

function extractRelevantTeamData(teams_info) {
  return teams_info.map((team_info) => {
    const { id, name, short_code, founded, logo_path } = team_info.data.data;
    return {
        teamID: id,
        teamname: name,
        shortname: short_code,
        founded: founded,
        logo: logo_path
    };
  });
}

async function teamSchedule(teamName) {
    const games = await DButils.execQuery(`select * from Games where homeTeam='${teamName}' or awayTeam='${teamName}'`);
    return games;
}

exports.teamDetails = teamDetails;
exports.teamSchedule = teamSchedule;
exports.extractRelevantTeamData = extractRelevantTeamData;