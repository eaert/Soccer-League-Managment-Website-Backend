var express = require("express");
var router = express.Router();
const players_utils = require("./utils/players_utils");
const team_utils = require("./utils/team_utils");

router.get("/teamFullDetails/:teamId", async (req, res, next) => {
  let team_details = [];
  try {
    const team_details = await players_utils.getPlayersByTeam(
      req.params.teamId
    );
    //we should keep implementing team page.....
    res.send(team_details);
  } catch (error) {
    next(error);
  }
});

router.get("/teamDetails/:teamId", async (req, res, next) => {
  try {
    const details = await team_utils.teamDetails(req.params);
    res.send(details);
  } catch (error) {
    next(error);
  }
});

router.get("/teamSchedule/:teamId", async (req, res, next) => {
  try {
    const team_games = await team_utils.teamSchedule(data.params)
    res.send(team_games);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
