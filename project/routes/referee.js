var express = require("express");
var router = express.Router();
const referee_utils = require("./utils/referee_utils");

router.get("/getAllReferees", async (req, res, next) => {
    try {
        const referees_details = await referee_utils.getReferees();
        res.send(referees_details);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
