const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

let projectData = {};

app.get("/", (req, res) => {
  res.status(200);
});

app.get("/post", (req, res) => {
  if (Object.keys(projectData).length === 0) {
    res.send(JSON.stringify(` No Data Found ! {} `));
  } else {
    res.status(200).send(projectData);
  }
});

app.post("/post", (req, res) => {
  projectData = req.body;
  console.log(projectData);
});

const port = 1000;
app.listen(port, () => {
  console.log(`Server is running on localhost port:${port}...`);
});
