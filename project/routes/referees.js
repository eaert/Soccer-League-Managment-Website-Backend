var express = require("express");
var router = express.Router();
const referees_utils = require("./utils/referees_utils");

router.get("/refereeDetails/:Referee_id", async (req, res, next) => {
    try {
      const referee = await referees_utils.refereeDetails(req.params.Referee_id);
      res.send(referee);
    } catch (error) {
      next(error);
    }
  });

  module.exports = router;
