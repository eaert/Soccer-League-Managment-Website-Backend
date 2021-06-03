var express = require("express");
var router = express.Router();
var app = express();
const DButils = require("./utils/DButils");
const users_utils = require("./utils/users_utils");
const players_utils = require("./utils/players_utils");
const teams_utils = require("./utils/teams_utils");

const Representative = require("../routes/representative");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.username) {
    DButils.execQuery("SELECT username FROM Users")
      .then((users) => {
        if (users.find((x) => x.username === req.session.username)) {
          req.username = req.session.username;
          next();
        }
      })
      .catch((err) => next(err));
  } else {
    res.sendStatus(401);
  }
});

router.use("/Representative", Representative);

/**
 * This path gets body with playerId and save this player in the favorites list of the logged-in user
 */
router.post("/favoritePlayers", async (req, res, next) => {
  try {
    const username = req.session.username;
    const player_id = req.body.player_id;
    await users_utils.markPlayerAsFavorite(username, player_id);
    res.status(201).send("The player successfully saved as favorite");
  } catch (error) {
    next(error);
  }
});

router.post("/favoriteTeams", async (req, res, next) => {
  try {
    const username = req.session.username;
    const team_id = req.body.team_id;
    await users_utils.markTeamAsFavorite(username, team_id);
    res.status(200).send("The team successfully saved as favorite")    
  } catch (error) {
    next(error);
  }
});

router.post("/favoriteGames", async (req, res, next) => {
  try {
    const username = req.session.username;
    const game_id = req.body.game_id;
    await users_utils.markGameAsFavorite(username, game_id);
    res.status(200).send("The game successfully saved as favorite")    
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the favorites players that were saved by the logged-in user
 */
router.get("/getfavoritePlayers", async (req, res, next) => {
  try {
    const username = req.session.username;
    const players = await users_utils.getFavoritePlayers(username);
    let player_array = players_utils.extractRelevantPlayerData(players);
    res.status(200).send(player_array);
  } catch (error) {
    next(error);
  }
});

router.get("/getfavoriteTeams", async (req, res, next) => {
  try {
    const username = req.session.username;
    const teams = await users_utils.getFavoriteTeams(username);
    let team_array = teams_utils.extractRelevantTeamData(teams);
    res.status(200).send(team_array);
  } catch (error) {
    next(error);
  }
});

router.get("/getfavoriteGames", async (req, res, next) => {
  try {
    const username = req.session.username;
    const games = await users_utils.getFavoriteGames(username);
    res.status(200).send(games);
  } catch (error) {
    next(error);
  }
});

router.delete("/deleteFavo/:details", async (req, res, next) => {
    try {
      let deleteDetails = JSON.parse(req.params.details);
      await users_utils.deleteFavo(req.session.username, deleteDetails);
      res.status(200).send("Target was removed.")
    } catch (error) {
      next(error);
    }
})

module.exports = router;
