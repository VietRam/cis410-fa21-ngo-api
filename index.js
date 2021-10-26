const express = require("express");

const db = require("./dbConnectExec.js");
const app = express();

app.listen(5000, () => {
  console.log(`app is running on port 5000`);
});

app.get("/hi", (req, res) => {
  res.send("hello worlds");
});

app.get("/", (req, res) => {
  res.send("API is running");
});

// app.post();
// app.put();

app.get("/cars", (req, res) => {
  //get data from database
  db.executeQuery(
    `SELECT *
  FROM Car
  LEFT JOIN CarType
  ON CarType.CarTypePK = Car.CarTypeFK`
  )
    .then((theResults) => {
      res.status(200).send(theResults);
    })
    .catch((myError) => {
      console.log(myError);
      res.status(500).send();
    });
});

app.get("/cars/:pk", (req, res) => {
  let pk = req.params.pk;
  //console.log(pk);
  let myQuery = `SELECT *
  FROM Car
  LEFT JOIN CarType
  ON CarType.CarTypePK = Car.CarTypeFK
  WHERE CarPK = ${pk}`;

  db.executeQuery(myQuery)
    .then((result) => {
      //console.log("result", result);
      if (result[0]) {
        res.send(result[0]);
      } else {
        res.status(404).send(`bad request`);
      }
    })
    .catch((err) => {
      console.log("Error in /cars/:pk", err);
      res.status(500).send();
    });
});
