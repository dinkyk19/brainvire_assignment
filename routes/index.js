const access = require("./access");
const task = require("./task");

module.exports = app => {
  app.use("/api/", access);
  app.use("/api/task/", task);

  app.get("/", async (req, res) => {
    res.json("Api success.")
  });

  app.use('*', (req, res) => {
    res.sendStatus(404);
  });

};