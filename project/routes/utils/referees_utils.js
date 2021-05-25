const axios = require("axios");
const DButils = require("./DButils");

async function refereeDetails(refereeID) {
    const referee = await DButils.execQuery(`select * from Referees where refereeID=${refereeID}`);
    return referee;
}

exports.refereeDetails = refereeDetails;
