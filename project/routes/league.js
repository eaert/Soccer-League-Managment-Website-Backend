var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");

router.get("/getDetails", async (req, res, next) => {
  try {
    const league_details = await league_utils.getLeagueDetails();
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

module.exports = router;
