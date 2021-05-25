const axios = require("axios");
const DButils = require("./DButils");

async function coachDetailsByTeamName(teamName) {
    const coach = await axios.get(
        `${process.env.api_domain}/teams/search/${teamName}`,
        {
          params: {
            include: Coaches,
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
            include: Coaches,
            api_token: process.env.api_token,
          },
        }
    );
    return extractRelevantCoachData(coach);
}

function extractRelevantCoachData(coaches_info) {
  return coaches_info.map((coach_info) => {
    const { coachID, firstname, lastname, nationality, birthday, birthcountry } = coach_info.data.data;
    return {
      coachID: coachID,
      firstname: firstname,
      lastname: lastname,
      nationality: nationality,
      birthday: birthday,
      birthcountry: birthcountry,
    };
  });
}

exports.coachDetailsByTeamName = coachDetailsByTeamName;
exports.coachDetailsByID = coachDetailsByID;
