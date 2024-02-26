const mysql = require("mysql2");
const dotenv = require("dotenv");
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});

connection.connect((err) => {
  if (err) {
    console.log(err.message);
  }
  if (process.env.PRINT === "TRUE") {
    console.log("sv_mysql.js : MariaDB is connected");
  }
  if (process.env.DEBUG === "TRUE") {
    console.log(
      "sv_mysql.js : \x1b[31mWe advice not sharing these credentials!\x1b[37m"
    );
    console.log("sv_mysql.js : Connected to MariaDB with = {");
    console.log(
      "sv_mysql.js :      User                : ",
      connection.config.user
    );
    console.log(
      "sv_mysql.js :      Password            : ",
      connection.config.password
    );
    console.log(
      "sv_mysql.js :      Adres               : ",
      connection.config.host + ":" + connection.config.port
    );
    console.log("sv_mysql.js : }");
    console.log(
      "sv_mysql.js : \x1b[31mWe advice not sharing these credentials!\x1b[37m"
    );
  }
});

class DbService {
  static getDbServiceInstance() {
    return instance ? instance : new DbService();
  }

  async searchByName(name) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM users WHERE userName = ?;";

        connection.query(query, [name], (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async insertNewName(userMail, userName, userPassword) {
    try {
      const dateAdded = new Date();
      const insertId = await new Promise((resolve, reject) => {
        const query =
          "INSERT INTO users (userMail, userName, userPassword, userCreated) VALUES (?,?, ?, ?);";

        connection.query(
          query,
          [userMail, userName, userPassword, dateAdded],
          (err, result) => {
            if (err) reject(new Error(err.message));
            resolve(result.insertId);
          }
        );
      });
      return {
        id: insertId,
        userMail: userMail,
        userName: userName,
        userPassword: userPassword,
        userCreated: dateAdded,
      };
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = DbService;
