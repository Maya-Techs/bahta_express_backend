const conn = require("../config/db.config");
const fs = require("fs");
async function install() {
  const queryfile = __dirname + "/sql/initial-queries.sql";

  let queries = [];
  let finalMessage = {};
  let templine = "";

  const lines = await fs.readFileSync(queryfile, "utf-8").split("\n");

  const executed = await new Promise((resolve, reject) => {
    lines.forEach((line) => {
      if (line.trim().startsWith("--") || line.trim() === "") {
        return;
      }
      templine += line;
      if (line.trim().endsWith(";")) {
        const sqlQuery = templine.trim();
        queries.push(sqlQuery);
        templine = "";
      }
    });
    resolve("Queries are added to the list");
  });

  for (let i = 0; i < queries.length; i++) {
    try {
      const result = await conn.query(queries[i]);
      console.log("Table created");
    } catch (err) {
      console.error(`Error occurred while executing query: ${queries[i]}`);
      console.error(err);
      finalMessage.message = "Not all tables are created";
    }
  }
  if (!finalMessage.message) {
    finalMessage.message = "All tables are created";
    finalMessage.status = 200;
  } else {
    finalMessage.status = 500;
  }
  return finalMessage;
}
module.exports = { install };
