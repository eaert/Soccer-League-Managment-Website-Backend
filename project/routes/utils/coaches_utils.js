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
  const { coach_id, firstname, lastname, nationality, birthdate, birthcountry } = coach_info.data.data[0].coach.data;
  return {
    coachID: coach_id,
    firstname: firstname,
    lastname: lastname,
    teamname: coach_info.data.data[0].name,
    nationality: nationality,
    birthday: birthdate,
    birthcountry: birthcountry,
  };
}

exports.coachDetailsByTeamName = coachDetailsByTeamName;
exports.coachDetailsByID = coachDetailsByID;
