const { default: axios } = require("axios");
var express = require("express");
var router = express.Router();
var search_utils = require("./utils/search_utils");

router.post("", async (req, res, next) => {
    try {
        // await initLeague();
        const results = await search_utils.searchByName(req.body.freeSearch, req.body.precise);
        res.send(results);
    } catch(error) {
        next(error);
    }
})

// async function initLeague() {
//     const teams = await axios.get(
//         `${process.env.api_domain}/teams/season/${process.env.season_id}`,
//         {
//           params: {
//             api_token: process.env.api_token,
//           },
//         }
//       );
//     var promises = [];
//     var DB = require("./utils/DButils");
//     (teams.data.data).forEach(team => {
//         promises.push(DB.execQuery(`insert into Teams values(${team.id}, ${1}, '${team.name}')`));
//     });
//     await Promise.all(promises);
// }

module.exports = router;
