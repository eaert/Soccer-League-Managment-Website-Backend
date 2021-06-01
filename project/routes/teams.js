var express = require("express");
var router = express.Router();
const players_utils = require("./utils/players_utils");
const teams_utils = require("./utils/teams_utils");
const coaches_utils = require("./utils/coaches_utils");
const games_utils = require("./utils/games_utils");

router.get("/teamFullDetails/:teamName", async (req, res, next) => {
  let team_details = {team: {}, games:{}, players: {}, coach: {}};
  try {
    team_details.team = await teams_utils.teamDetails(req.params.teamName);
    team_details.games = await games_utils.getGamesByTeamName(req.params.teamName);
    team_details.players = await players_utils.getPlayersByTeam(req.params.teamName);
    team_details.coach = await coaches_utils.coachDetailsByTeamName(req.params.teamName);
    res.send(team_details);
  } catch (error) {
    next(error);
  }
});

router.get("/teamDetails/:teamName", async (req, res, next) => {
  try {
    const details = await teams_utils.teamDetails(req.params.teamName);
    res.send(details);
  } catch (error) {
    next(error);
  }
});

router.get("/teamSchedule/:teamName", async (req, res, next) => {
  try {
    const team_games = await teams_utils.teamSchedule(req.params.teamName)
    res.send(team_games);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
