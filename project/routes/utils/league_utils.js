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
  // if (league.data.data.current_stage_id) {
  //   var stage = await axios.get(
  //     `https://soccer.sportmonks.com/api/v2.0/stages/${league.data.data.current_stage_id}`,
  //     {
  //       params: {
  //         api_token: process.env.api_token,
  //       },
  //     }
  //   );
  //   stage = stage.data.data.name;
  // } else {
    stage = await DButils.execQuery('select roundNum from Leagues where leagueID=1');
  // }
  const roundNum = (await DButils.execQuery(`select roundNum from Leagues where leagueID=1`))[0].roundNum;
  const nextGames = await Games(roundNum);
  return {
    league_name: league.data.data.name,
    current_season_name: league.data.data.season.data.name,
    current_stage_name: stage,
    next_game: nextGames[0]
  };
}

async function getLeagueFullDetails() {
  const league = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/leagues/${LEAGUE_ID}`,
    {
      params: {
        include: "season",
        api_token: process.env.api_token,
      },
    }
  );
  const teams = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/teams/season/${process.env.season_id}`,
    {
      params: {
        api_token: process.env.api_token,
      },
    }
  );
  stage = await DButils.execQuery('select roundNum from Leagues where leagueID=1');
  const roundNum = (await DButils.execQuery(`select roundNum from Leagues where leagueID=1`))[0].roundNum;
  const nextGames = await Games(roundNum);
  var prevGames = [];
  if (roundNum > 1) {
    prevGamesData = await Games(roundNum-1);
    var gamesID = [];
    for (let index = 0; index < prevGamesData.length; index++) {
      gamesID.push(prevGamesData[index].gameID);
    }
    var gameLog = await games_utils.getGameLogsByGameID(gamesID);
    for (let index = 0; index < prevGamesData.length; index++) {
      prevGames.push({
        game: prevGamesData[index],
        log: gameLog[index]
      })
    }
  }
  return {
    league_name: league.data.data.name,
    current_season_name: league.data.data.season.data.name,
    current_stage_name: stage,
    teams: teams.data.data,
    next_games: nextGames,
    prev_games: prevGames
  };
}

async function Games(roundNum) {
  const month = 6 + Math.floor((roundNum * 7)/28)
  const day = 6 + ((roundNum - 1) * 7) - ((month - 6) * 28)
  const roundDate = `2021/${month}/${day}`
  const Games = await DButils.execQuery(`select * from Games where date='${roundDate}'`)
  return Games;
}

async function createLeague(data) {
  await DButils.execQuery(
    `insert into Leagues values ('${data.leagueName}', ${data.roundNum}, ${data.mechanismPlacement},
     '${data.Representative}')`
  );
}

async function createGameLog(leagueID) {
  const mechanism = await DButils.execQuery(`select mechanismPlacement from Leagues where leagueID=${leagueID}`);
  const teams = await DButils.execQuery(`select teamName, venue from Teams where leagueID=${leagueID}`);

  let promises = [];

  const stages = roundRobin(teams, mechanism[0].mechanismPlacement);

  let seasonDetails = {
    year: '2021',
    month: '6',
    day: '6'
  }
  stages.forEach(stage => {
    stage.forEach(game => {
      var date = `${seasonDetails.year}/${seasonDetails.month}/${seasonDetails.day}`;
        promises.push(
          DButils.execQuery(`insert into Games values('${date}', '21:45', '${game[0].teamName}', '${game[1].teamName}', -1, -1, '${game[0].venue}', 0)`)
        )
    });
    seasonDetails = dateManager(seasonDetails);
  });
  await Promise.all(promises);
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

function roundRobin(teams, mechanism){
  let scheduling = [];
  let scheduling_opposite = []
  if (teams.length % 2 != 0){
      throw { status: 409, message: "Number of teams must be even."};
  }
  mid = teams.length/2;
  let left = [];
  let right = [];
  teams.forEach(function(element, index) {
      if (index<mid){
          left.push(element);
      }
      else{
          right.push(element);
      }
  });
  let end_loop = right[0];
  let stop_flag = false;
  //start loop
  while(!stop_flag){
      let round = [];
      let round_oppo = [];
      temp = left[1];
      for (i=1; i<left.length-1; i++){
          left[i] = left[i+1];
      }
      left[left.length-1] = right[right.length-1]
      for (i=right.length-1; i>0; i--){
          right[i] = right[i-1];
      }
      right[0] = temp;
      for (i=0; i<left.length; i++){
          if(left.includes(10000000000000000) || right.includes(10000000000000000)){
              continue;
          }
          round.push([left[i],right[i]])
          round_oppo.push([right[i],left[i]])
      }
      scheduling.push(round);
      scheduling_opposite.push(round_oppo);
      if (right[0]==end_loop){
          stop_flag = true;
      }
  }
  let scheduling_final;
  if (mechanism == 2){
      scheduling_final = scheduling.concat(scheduling_opposite);
  }
  else{
      scheduling_final = scheduling;
  }
  return scheduling_final;
}

async function getLeagueStageDate(leagueID) {
  const stageNum = await DButils.execQuery(`select roundNum from Leagues where leagueID=${leagueID}`);
  let seasonDetails = {
    year: '2021',
    month: '6',
    day: '6'
  }
  for (let i=0;i<stageNum[0].roundNum-1;i++) {
    seasonDetails = dateManager(seasonDetails);
  }
  var date = `${seasonDetails.year}/${seasonDetails.month}/${seasonDetails.day}`;
  const games = games_utils.getGames(date);
  return games;
}

async function leagueTeams() {
  const teams = await DButils.execQuery('select teamName, venue from Teams')
  return teams;
}


exports.getLeagueDetails = getLeagueDetails;
exports.getLeagueFullDetails = getLeagueFullDetails;
exports.createLeague = createLeague;
exports.createGameLog = createGameLog;
exports.getLeagueStageDate = getLeagueStageDate;
exports.leagueTeams = leagueTeams;
exports.dateManager = dateManager;
