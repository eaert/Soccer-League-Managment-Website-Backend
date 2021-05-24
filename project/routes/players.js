const { default: axios } = require("axios");
var express = require("express");
var router = express.Router();
const players_utils = require("./utils/players_utils");


router.get("/playerDetails/:playerID", async (req, res, next) => {
    try {
        const details = await players_utils.playerDetails(req.params);
        res.send(details);
    } catch(error) {
        next(error);
    }
});

module.exports = router;
