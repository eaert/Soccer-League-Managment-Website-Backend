var express = require("express");
var router = express.Router();
var app = express();
const games_utils = require("./utils/games_utils");

router.use("/addGame" ,async function (req, res, next) { 
  try {
    if (!games_utils.isTeamExist(req.body.homeTeam) || !games_utils.isTeamExist(req.body.awayTeam)){
      throw { status: 400, message: "One of the received Teams don't exist" };
    } 
    if (req.body.homeTeamGoals < 0 || req.body.awayTeamGoals < 0){
      throw { status: 400, message: "Team's Goals must be positive number"}
    }
  } catch(error) {
    next(error)
  }
});

router.post("/addGame", async (req, res, next) => {
  try {
    await games_utils.createGame(req.body);
    res.status(201).send("Game created");
  } catch (error) {
    next(error);
  }
});

router.put("/updateScore", async (req, res, next) => {
  try {
    await games_utils.updateGameScore(req.body);
    res.status(201).send("Game Score been update.");
  } catch (error) {
    next(error);
  }
});

router.use("/setReferee" ,async function (req, res, next) { 
  try {
    if (games_utils.isRefereeExist(req.body.referee)){
      throw { status: 400, message: "Requested Referee doens't exist"}
    }
  } catch(error) {
    next(error)
  }
});

router.put("/setReferee", async (req, res, next) => {
  try {
    await games_utils.setReferee(req.body);
    res.status(201).send("Game's referee been update.");
  } catch (error) {
    next(error);
  }
});

router.get("/gameDetails/:gameID", async (req, res, next) => {
  try {
    const details = await games_utils.gameDetails(req.params.gameID);
    res.send(details);
  } catch (error) {
    next(error);
  }
})

module.exports = router;
