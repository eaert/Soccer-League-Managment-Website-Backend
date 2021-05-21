var express = require("express");
var router = express.Router();
const game_utils = require("./utils/game_utils");
var generateGameID = 0;

router.get("/addGame", async (req, res, next) => {
  try {
    if (!game_utils.isTeamExist(req.body.homeTeam) || !game_utils.isTeamExist(req.body.awayTeam)){
        throw { status: 400, message: "One of the received Teams don't exist" };
    } 
    if (req.body.homeTeamGoals < 0 || req.body.awayTeamGoals < 0){
        throw { status: 400, message: "Team's Goals must be positive number"}
    }
    await DButils.execQuery(
        `insert into Game values ('${generateGameID++}',${req.body.time}, ${req.body.homeTeam}, ${req.body.awayTeam},
         ${req.body.homeTeamGoals}, ${req.body.awayTeamGoals}, ${req.body.field}, ${req.body.referee})`
      );
      res.status(201).send("Game created");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
