var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");
const games_utils = require("./utils/games_utils");

router.get("/getDetails", async (req, res, next) => {
  try {
    const league_details = await league_utils.getLeagueDetails();
    res.send(league_details);
  } catch (error) {
    next(error);
  }
});

router.get("/getFullDetails", async (req, res, next) => {
  try {
    const league_details = await league_utils.getLeagueFullDetails();
    res.send(league_details);
  } catch (error) {
    next(error);
  }
});

router.post("/createLeague", async (req, res, next) => {
  try {
    await league_utils.createLeague(req.body);
    res.status(201).send("League been created Successfuly");
  } catch (error) {
    next(error);
  }
});

router.get("/getLeagueStageGames/:leagueID", async (req, res, next) => {
  try {
    const games = await league_utils.getLeagueStageDate(req.params.leagueID);
    res.send(games);
  } catch (error) {
    next(error);
  }
})

module.exports = router;
