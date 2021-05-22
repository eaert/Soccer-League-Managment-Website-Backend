var express = require("express");
var router = express.Router();
const game_utils = require("./utils/game_utils");

router.get("/addGame", async (req, res, next) => {
  try {
    if (!game_utils.isTeamExist(req.body.homeTeam) || !game_utils.isTeamExist(req.body.awayTeam)){
        throw { status: 400, message: "One of the received Teams don't exist" };
    } 
    if (req.body.homeTeamGoals < 0 || req.body.awayTeamGoals < 0){
        throw { status: 400, message: "Team's Goals must be positive number"}
    }
    await game_utils.createGame(req.body);
    res.status(201).send("Game created");
  } catch (error) {
    next(error);
  }
});

router.put("/updateScore", async (req, res, next) => {
  try {
    await game_utils.updateGameScore(req.body);
    res.status(201).send("Game Score been update.");
  } catch (error) {
    next(error);
  }
});

router.put("/setReferee", async (req, res, next) => {
  try {
    if (game_utils.isRefereeExist(req.data.referee)){
      throw { status: 400, message: "Requested Referee doens't exist"}
    }
    await game_utils.setReferee(req.body);
    res.status(201).send("Game's referee been update.");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
