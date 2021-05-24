var express = require("express");
var router = express.Router();
var app = express();
const DButils = require("./utils/DButils");
const users_utils = require("./utils/users_utils");
const players_utils = require("./utils/players_utils");

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

router.use(async function (req, res, next) { 
  if (req.session && req.session.username) {
    DButils.execQuery("SELECT Representative FROM Leagues")
      .then((Representative) => {
        if (Representative.find((x) => x.Representative === req.session.username)) {
            next();
        }
      })
      .catch((err) => next(err));
  } else {
    res.sendStatus(401);
  }
});

// app.use("/Representative", Representative);

/**
 * This path gets body with playerId and save this player in the favorites list of the logged-in user
 */
router.post("/favoritePlayers", async (req, res, next) => {
  try {
    const username = req.session.username;
    const player_id = req.body.playerId;
    await users_utils.markPlayerAsFavorite(username, player_id);
    res.status(201).send("The player successfully saved as favorite");
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the favorites players that were saved by the logged-in user
 */
router.get("/favoritePlayers:username", async (req, res, next) => {
  try {
    const username = req.session.username;
    let favorite_players = {};
    const player_ids = await users_utils.getFavoritePlayers(username);
    let player_ids_array = [];
    player_ids.map((element) => player_ids_array.push(element.player_id)); //extracting the players ids into array
    const results = await players_utils.getPlayersInfo(player_ids_array);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

router.get("/favoriteTeams:username", async (req, res, next) => {
  try {
    const username = req.session.username;
    const team_ids = await users_utils.getFavoriteTeams(username);
    let team_ids_array = [];
    team_ids.map((element) => team_ids_array.push(element.team_id)); //extracting the players ids into array
    const results = await teams_utils.getTeamsInfo(team_ids_array);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

router.get("/favoriteGames:username", async (req, res, next) => {
  try {
    const username = req.session.username;
    const game_ids = await users_utils.getFavoriteGames(username);
    let game_ids_array = [];
    game_ids.map((element) => game_ids_array.push(element.game_id)); //extracting the players ids into array
    const results = await games_utils.getGamesInfo(game_ids_array);
    res.status(200).send(results);
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

module.exports = router;
