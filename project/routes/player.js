const { default: axios } = require("axios");
var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");


router.get("/playerFullDetails/:playerID", async (req, res, next) => {
    const player = await axios.get(`https://soccer.sportmonks.com/api/v2.0/players/${req.params.playerID}`,
    {
        params: {
            api_token: process.env.api_token,
        },
    });
    res.send(player);
});