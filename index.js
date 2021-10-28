const express = require("express");

const db = require("./dbConnectExec.js");
const app = express();
app.use(express.json());

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

app.post("/owner", async (req, res) => {
  //res.send("/owner called");

  //onsole.log("request body", req.body);

  let nameFirst = req.body.nameFirst;
  let nameLast = req.body.nameLast;
  let email = req.body.Email;
  let password = req.body.Password;

  let emailCheckQuery = `SELECT Email 
  FROM Owner
  WHERE Email = '${email}'`;

  let existingUser = await db.executeQuery(emailCheckQuery);

  //console.log("existing user", existingUser);

  if (existingUser[0]) {
    return res.status(409).send("duplicate email");
  }
  let insertQuery = `INSERT INTO owner(NameFirst, NameLast, Email, Password)
  VALUES('${nameFirst}', '${nameLast}','${email}','${password}')`;

  dbexecuteQuery(insertQuery)
    .then(() => {
      res.status(201).send();
    })
    .catch((err) => {
      console.log("error in POST /contact", err);
      res.status(500).send();
    });
});

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
