const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const exportMysql = require("../database/sv_mysql");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/search/:name", (request, response) => {
  const { name } = request.params;

  const db = exportMysql.getDbServiceInstance();

  const result = db.searchByName(name);

  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});

app.post("/insert", (request, response) => {
  const { userMail, userName, userPassword } = request.body;
  const db = exportMysql.getDbServiceInstance();

  const result = db.insertNewName(userMail, userName, userPassword);

  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});

app.listen(process.env.PORT, () => {
  if (process.env.PRINT === "TRUE") {
    console.log("sv_script.js : Node is active");
  }

  if (process.env.DEBUG === "TRUE") {
    console.log(
      "sv_script.js : \x1b[31mWe advice not sharing these credentials!\x1b[37m"
    );
    console.log("sv_script.js : Node is running with = {");
    console.log("sv_mysql.js :      Running on port      : ", process.env.PORT);
    console.log("sv_script.js : }");
    console.log(
      "sv_script.js : \x1b[31mWe advice not sharing these credentials!\x1b[37m"
    );
  }
});

process.on("SIGINT", () => {
  if (process.env.PRINT === "TRUE") {
    console.log("sv_script.js : Node is deactivated");
  }
  connection.end();
  process.exit();
});
