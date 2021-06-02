const axios = require("axios");
const DButils = require("./DButils");

async function coachDetailsByTeamName(teamName) {
    const coach = await axios.get(
        `${process.env.api_domain}/teams/search/${teamName}`,
        {
          params: {
            include: 'coach',
            api_token: process.env.api_token,
          },
        }
    );
    let team = coach.data.data.name;
    coach.data.data = coach.data.data[0].coach.data;
    coach.data.data.name = team;
    return extractRelevantCoachData(coach);
}

async function coachDetailsByID(coachID) {
    const coach = await axios.get(
        `${process.env.api_domain}/coaches/${coachID}`,
        {
          params: {
            api_token: process.env.api_token,
          },
        }
    );
    return extractRelevantCoachData(coach);
}

function extractRelevantCoachData(coach_info) {
  const { coach_id, firstname, lastname, nationality, birthdate, birthcountry, team } = coach_info.data.data;
  return {
    coachID: coach_id,
    firstname: firstname,
    lastname: lastname,
    teamname: team,
    nationality: nationality,
    birthday: birthdate,
    birthcountry: birthcountry,
  };
}

exports.coachDetailsByTeamName = coachDetailsByTeamName;
exports.coachDetailsByID = coachDetailsByID;
