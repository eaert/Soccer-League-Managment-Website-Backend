var express = require("express");
var router = express.Router();
const representative_utils = require("./utils/representative_utils");
const game_utils = require("./utils/game_utils");
const league_utils = require("./utils/league_utils");

router.post("/addGame", async (req, res, next) => {
    try {
      await game_utils.createGame(req.body);
      res.status(201).send("The game successfully added");
    } catch (error) {
      next(error);
    }
});

router.post("/createGameLog", async (req, res, next) => {
    try {
      await league_utils.createGameLog(req.body);
      res.status(201).send("League's game log successfully created");
    } catch (error) {
      next(error);
    }
});

router.put("/updateScore", async (req, res, next) => {
    try {
        await game_utils.updateGameScore(req.body);
        res.status(201).send("The score been updated")
    } catch (error) {
        next(error);
    }
});

router.post("/addEventCale", async (req, res, next) => {
    try {
      await game_utils.addEventCale(req.body);
      res.status(201).send("A new game calendar has been added to the game");
    } catch (error) {
      next(error);
    }
});

router.put("/setReferee", async (req, res, next) => {
    try {
        await game_utils.setReferee(req.body);
        res.status(201).send("The referee been updated")
    } catch (error) {
        next(error);
    }
});