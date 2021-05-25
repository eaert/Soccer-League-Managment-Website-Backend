var express = require("express");
var router = express.Router();
const coaches_utils = require("./utils/coaches_utils");


router.get("/coachDetails/:coachID", async (req, res, next) => {
  try {
    const coach = await coaches_utils.coachDetailsByID(req.params.coachID);
    res.send(coach);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
