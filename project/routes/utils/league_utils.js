const axios = require("axios");
const DButils = require("./DButils");
const games_utils = require("./games_utils");
const LEAGUE_ID = 271;

async function getLeagueDetails() {
  const league = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/leagues/${LEAGUE_ID}`,
    {
      params: {
        include: "season",
        api_token: process.env.api_token,
      },
    }
  );
  const stage = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/stages/${league.data.data.current_stage_id}`,
    {
      params: {
        api_token: process.env.api_token,
      },
    }
  );
  return {
    league_name: league.data.data.name,
    current_season_name: league.data.data.season.data.name,
    current_stage_name: stage.data.data.name,
    // next game details should come from DB
  };
}

async function createLeague(data) {
  await DButils.execQuery(
    `insert into Leagues values ('${data.leagueName}', ${data.roundNum}, ${data.mechanismPlacement},
     '${data.Representative}')`
  );
}

async function createGameLog(data) {
  const mechanism = await DButils.execQuery(`select mechanismPlacement from Leagues where leagueID=${data.leagueID}`);
  const teams = await DButils.execQuery(`select teamName from Teams where leagueID=${data.leagueID}`);

  let promises = [];
  teams.forEach(homeTeam => {
    let seasonDetails = {
      year: '2021',
      month: '1',
      day: '1'
    }
    teams.forEach(awayTeam => {
      if (homeTeam === awayTeam) {
        return;
      } else {
        var date = `${seasonDetails.year}-${seasonDetails.month}-${seasonDetails.day}`;
        promises.push(
          DButils.execQuery(`insert into Games values('${date}', '21:45', '${homeTeam.teamName}', '${awayTeam.teamName}', -1, -1, '${'Stadium'}', 0)`)
        )
        let day = parseInt(seasonDetails.day) + 7;
        if (day > 30) {
          let month = parseInt(seasonDetails.month) + 1;
          seasonDetails.month = month.toString();
          seasonDetails.day = '1';
          if (seasonDetails.month > 12) {
            let year = parseInt(seasonDetails.year) + 1;
            seasonDetails.year = year.toString();
            seasonDetails.month = '1';
          }
        } else {
          seasonDetails.day = day.toString();
        }
      }
    });
  });
  await Promise.all(promises);
}

exports.getLeagueDetails = getLeagueDetails;
exports.createLeague = createLeague;
exports.createGameLog = createGameLog;
