const axios = require("axios");
const DButils = require("./DButils");

async function refereeDetails(refereeID) {
    const referee = await DButils.execQuery(`select * from Referees where refereeID=${refereeID}`);
    return referee;
}

async function createReferee(data) {
    await DButils.execQuery(`insert into Referees values('${data.firstname}', '${data.lastname}', '${data.nation}', 'false')`);
}

async function getAllReferees() {
    return await DButils.execQuery(`select * from Referees`);
}

exports.refereeDetails = refereeDetails;
exports.createReferee = createReferee;
exports.getAllReferees = getAllReferees;
