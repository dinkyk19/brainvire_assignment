const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./users")(sequelize, Sequelize);
db.tasks = require("./tasks")(sequelize, Sequelize);

Object.keys(db).forEach(function (modelName) {
  if ('associate' in db[modelName]) {
      db[modelName].associate(db);
  }
});
module.exports = db;