const DButils = require("./DButils");

async function getAllReferees() {
    return await DButils.execQuery("SELECT * FROM Referees")
}

async function getReferee(referee_id) {
    return await DButils.execQuery(`SELECT * from Referees WHERE refereeID=${referee_id}`)
}

exports.getAllReferees = getAllReferees;
exports.getReferee = getReferee;