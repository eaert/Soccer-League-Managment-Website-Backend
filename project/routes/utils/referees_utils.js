const axios = require("axios");
const DButils = require("./DButils");

async function refereeDetails(refereeID) {
    const referee = await DButils.execQuery(`select * from Referees where refereeID=${refereeID}`);
    if (referee[0]) {
        return {
            refereeID: referee[0].refereeID,
            firstname: referee[0].firstname,
            lastname: referee[0].lastname,
            nation: referee[0].nation
        };
    }
    return null;
}

async function createReferee(data) {
    await DButils.execQuery(`insert into Referees values('${data.firstname}', '${data.lastname}', '${data.nation}', '${data.username}')`);
}

async function getAllReferees() {
    return await DButils.execQuery(`select * from Referees`);
}

exports.refereeDetails = refereeDetails;
exports.createReferee = createReferee;
exports.getAllReferees = getAllReferees;
