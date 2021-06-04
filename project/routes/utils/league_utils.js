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
  var stage = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/stages/${league.data.data.current_stage_id}`,
    {
      params: {
        api_token: process.env.api_token,
      },
    }
  );
  if (!stage) {
    stage = await DButils.execQuery('select roundNum from Leagues where leagueID=1');
  }
  const roundNum = (await DButils.execQuery(`select roundNum from Leagues where leagueID=3`))[0].roundNum;
  const month = Math.floor((roundNum * 7)/28) + 1
  const day = ((roundNum - 1) * 7) - ((month - 1) * 28) + 1
  const roundDate = `2021-${month}-${day}`
  const nextGame = (await DButils.execQuery(`select * from Games where date='${roundDate}'`))[0]
  return {
    league_name: league.data.data.name,
    current_season_name: league.data.data.season.data.name,
    current_stage_name: stage.data.data.name,
    next_game: nextGame
  };
}

async function createLeague(data) {
  await DButils.execQuery(
    `insert into Leagues values ('${data.leagueName}', ${data.roundNum}, ${data.mechanismPlacement},
     '${data.Representative}')`
  );
}

async function createGameLog(data) {
  // const mechanism = await DButils.execQuery(`select mechanismPlacement from Leagues where leagueID=${data.leagueID}`);
  // const teams = await DButils.execQuery(`select teamName from Teams where leagueID=${data.leagueID}`);

  // let promises = [];
  // var teamsData = []
  // var ID = 1;
  // teams.forEach(team => {
  //   teamsData.push({id: ID++, name: team.teamName})
  // });
  
  // teams.forEach(homeTeam => {
  //   let seasonDetails = {
  //     year: '2021',
  //     month: '1',
  //     day: '1'
  //   }
  //   var index = 0;
  //   teams.forEach(awayTeam => {
  //     if (homeTeam === awayTeam) {
  //       return;
  //     } else {
  //       while (teamsDayTaken[index].includes(homeTeam.teamName) || teamsDayTaken[index].includes(awayTeam.teamName)) {
  //         seasonDetails = dateManager(seasonDetails);
  //         index++;
  //         if (index === teamsDayTaken.length) {
  //           teamsDayTaken.push([]);
  //         }
  //       }

  //       var date = `${seasonDetails.year}-${seasonDetails.month}-${seasonDetails.day}`;
  //       promises.push(
  //         DButils.execQuery(`insert into Games values('${date}', '21:45', '${homeTeam.teamName}', '${awayTeam.teamName}', -1, -1, '${'Stadium'}', 0)`)
  //       )
  //       teamsDayTaken[index].push(homeTeam.teamName);
  //       teamsDayTaken[index].push(awayTeam.teamName);
  //       index = 0;
  //       seasonDetails = {
  //         year: '2021',
  //         month: '1',
  //         day: '1'
  //       }
        
  //     }
  //   });
  // });
  // await Promise.all(promises);
}

function dateManager(seasonDetails) {
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
  return seasonDetails;
}

exports.getLeagueDetails = getLeagueDetails;
exports.createLeague = createLeague;
exports.createGameLog = createGameLog;
