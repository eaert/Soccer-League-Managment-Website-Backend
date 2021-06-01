const DButils = require("./DButils");
const bcrypt = require("bcryptjs");

async function Register(data) {
    const users = await DButils.execQuery(
        "SELECT username FROM users"
      );
  
      if (users.find((x) => x.username === data.username))
        throw { status: 409, message: "Username taken" };
  
      //hash the password
      let hash_password = bcrypt.hashSync(
        data.password,
        parseInt(process.env.bcrypt_saltRounds)
      );
      data.password = hash_password;
  
      // add the new username
      await DButils.execQuery(
        `INSERT INTO Users VALUES ('${data.username}', '${data.firstname}', '${data.lastname}',
        '${data.country}', '${hash_password}', '${data.email}', '${data.image_url}')`
      );
}

exports.Register = Register;