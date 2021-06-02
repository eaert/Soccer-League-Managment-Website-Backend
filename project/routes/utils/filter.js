const axios = require("axios");
const DButils = require("./DButils");

async function filterTeams(data) {
    var filterData = [];
    const teams_DB = await DButils.execQuery(`select teamID from Teams`);
    const teamsID = teams_DB.map(x => x.teamID)
    data.forEach(team => {
        if (teamsID.includes(team.id)) {
            filterData.push({
                teamID: team.id,
                teamname: team.name,
                shortname: team.short_code,
                founded: team.founded,
                logo: team.logo_path
            });
        }
    });
    return filterData;
}

async function filterPlayers(data) {
    var filterData = [];
    const teams_DB = await DButils.execQuery(`select teamID from Teams`);
    const teamsID = teams_DB.map(x => x.teamID)
    data.forEach(player => {
        if (teamsID.includes(player.team_id)) {
            filterData.push({
                playerID: player.player_id,
                firstname: player.firstname,
                lastname: player.lastname,
                image: player.image_path,
                position: player.position_id,
                nation: player.nationality,
                team_name: player.team.data.name,
            });
        }
    });
    return filterData;
}

exports.filterTeams = filterTeams;
exports.filterPlayers = filterPlayers;