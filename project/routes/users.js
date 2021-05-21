var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const users_utils = require("./utils/users_utils");
const players_utils = require("./utils/players_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users_tirgul")
      .then((users) => {
        if (users.find((x) => x.user_id === req.session.user_id)) {
          req.user_id = req.session.user_id;
          next();
        }
      })
      .catch((err) => next(err));
  } else {
    res.sendStatus(401);
  }
});

/**
 * This path gets body with playerId and save this player in the favorites list of the logged-in user
 */
router.post("/favoritePlayers", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const player_id = req.body.playerId;
    await users_utils.markPlayerAsFavorite(user_id, player_id);
    res.status(201).send("The player successfully saved as favorite");
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the favorites players that were saved by the logged-in user
 */
router.get("/favoritePlayers", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    let favorite_players = {};
    const player_ids = await users_utils.getFavoritePlayers(user_id);
    let player_ids_array = [];
    player_ids.map((element) => player_ids_array.push(element.player_id)); //extracting the players ids into array
    const results = await players_utils.getPlayersInfo(player_ids_array);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

router.get("/favoriteTeams", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const team_ids = await users_utils.getFavoriteTeams(user_id);
    let team_ids_array = [];
    team_ids.map((element) => team_ids_array.push(element.team_id)); //extracting the players ids into array
    const results = await teams_utils.getTeamsInfo(team_ids_array);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

router.get("/favoriteGames", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const game_ids = await users_utils.getFavoriteGames(user_id);
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
    const user_id = req.session.user_id;
    const team_id = req.body.team_id;
    await users_utils.markTeamAsFavorite(user_id, team_id);
    res.status(200).send("The team successfully saved as favorite")    
  } catch (error) {
    next(error);
  }
});

router.post("/favoriteGames", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const game_id = req.body.game_id;
    await users_utils.markGameAsFavorite(user_id, game_id);
    res.status(200).send("The game successfully saved as favorite")    
  } catch (error) {
    next(error);
  }
});

module.exports = router;
