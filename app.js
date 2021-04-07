const express = require("express");
const app = express();
var path = require('path')
const configRoutes = require('./routes');
const port = process.env.PORT;
require('dotenv').config();

app.use(express.urlencoded({ extended: true }))
app.use(express.json()); 

app.use("/public", express.static(path.join(__dirname, 'public')));

app.all('/*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers,crossdomain,withcredentials,Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Origin");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        next();
});

configRoutes(app);

try {
  app.listen(port, () => { console.log(`server running at port ${port}`) })
} catch (error) {
  console.log("error", error)
}