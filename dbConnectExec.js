const sql = require("mssql");
const carsConfig = require("./config.js");

const config = {
  user: carsConfig.DB.user,
  password: carsConfig.DB.password,
  server: carsConfig.DB.server, // You can use 'localhost\\instance' to connect to named instance
  database: carsConfig.DB.database,
};

async function executeQuery(aQuery) {
  let connection = await sql.connect(config);
  let result = await connection.query(aQuery);

  //console.log(result);
  return result.recordset;
}

// executeQuery(`SELECT *
// FROM Car
// LEFT JOIN CarType
// ON CarType.CarTypePK = Car.CarTypeFK`);

module.exports = { executeQuery: executeQuery };
