const { default: axios } = require("axios");
var express = require("express");
var router = express.Router();
var search_utils = require("./utils/search_utils");

router.post("", async (req, res, next) => {
    try {
        const results = await search_utils.searchByName(req.body.freeSearch, req.body.precise);
        res.send(results);
    } catch(error) {
        next(error);
    }
})

module.exports = router;
