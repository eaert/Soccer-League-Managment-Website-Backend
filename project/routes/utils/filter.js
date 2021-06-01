const axios = require("axios");
const DButils = require("./DButils");

async function filterTeams(data) {
    var filterData = [];
    data.forEach(team => {
        if (team.current_season_id == process.env.season_id) {
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
    const teamsID = await DButils.execQuery(`select teamID from Teams`);
    data.forEach(player => {
        if (player.team_id in teamsID) {
            filterData.push({
                playerID: player_id,
                firstname: firstname,
                lastname: lastname,
                image: image_path,
                position: position_id,
                nation: nationality,
                team_name: player.team.data.name,
            });
        }
    });
    return filterData;
}

exports.filterTeams = filterTeams;
exports.filterPlayers = filterPlayers;