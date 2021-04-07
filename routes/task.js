const express = require('express');
const router = express.Router();
const sqldb = require("../models");
const Authenciation = require("./authentication");
const moment = require('moment');
const global_string = require("./globalstring");

/* 
** Create new task by user **
API URL: localhost:3000/api/task/create
Method : POST,
Header : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpZGVudGlmaWVyIjoiNTQyZCEiLCJpYXQiOjE2MTc3Mjc2MDl9.kOD7cPZwW5JmKN-f1Jlp-g6HKIfIqgqZX92IEZBAjk8"
Payload : {
    "user_id" : 1,
    "task_name" : "meeting",
    "description" : "meeting with client"
}
*/
router.post("/create", Authenciation, async (req, res) => {
    try {
        if (!req.body.user_id) {
            res.status(404).json({ "status": 0, "message": global_string.user_not_found });
        } else if (!req.body.task_name) {
            res.status(404).json({ "status": 0, "message": global_string.task_name_not_found });
        } else {
            let task_insert_data = {
                task_name: req.body.task_name,
                user_id: req.body.user_id,
                description: req.body.description ? req.body.description : "",
                is_completed: 0,
                is_deleted: 0
            }

            let data = await sqldb.tasks.create(task_insert_data);
            res.status(200).json({ "status": 1, "message": "Task has been created successfully.", "data": data });
        }
    } catch (e) {
        res.status(400).json({ "status": 0, "message": e.message });
    }
});

/* 
** Delete task **
API URL: localhost:3000/api/task/1
Method : DELETE,
Header : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpZGVudGlmaWVyIjoiNTQyZCEiLCJpYXQiOjE2MTc3Mjc2MDl9.kOD7cPZwW5JmKN-f1Jlp-g6HKIfIqgqZX92IEZBAjk8"
Payload : {
    "user_id" : 1,
    "task_name" : "meeting",
    "description" : "meeting with client"
}
*/
router.delete("/:task_id", Authenciation, async (req, res) => {
    try {
        if (req.params.task_id == 0) {
            res.status(404).json({ "status": 0, "message": global_string.task_id_not_found });
        } else {
            let task_data = await sqldb.tasks.findOne({
                where: { is_completed: 0, task_id: req.params.task_id },
                attributes: ["task_id"]
            })
            if (task_data) {
                let delete_task = await sqldb.tasks.update({
                    is_deleted: 1
                }, {
                    where: { task_id: req.params.task_id, is_completed: 0 }
                });
                res.status(200).json({ "status": 1, "message": "Task has been deleted successfully." });
            } else {
                res.status(400).json({ "status": 1, "message": "Task cannot be delete because it is completed." });
            }

        }
    } catch (e) {
        res.status(400).json({ "status": 0, "message": e.message });
    }
});

/* 
** Complete task **
API URL: localhost:3000/api/task/completed
Method : PUT,
Header : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpZGVudGlmaWVyIjoiNTQyZCEiLCJpYXQiOjE2MTc3Mjc2MDl9.kOD7cPZwW5JmKN-f1Jlp-g6HKIfIqgqZX92IEZBAjk8"
Payload :{
    "task_id" : 3
}
*/
router.put("/completed", Authenciation, async (req, res) => {
    try {
        if (!req.body.task_id) {
            res.status(404).json({ "status": 0, "message": global_string.task_id_not_found });
        } else {
            let complete_task = await sqldb.tasks.update({
                is_completed: 1,
                date_of_completion: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
            }, {
                where: { task_id: req.body.task_id }
            });

            res.status(200).json({ "status": 1, "message": "Task has been completed successfully." });
        }
    } catch (e) {
        res.status(400).json({ "status": 0, "message": e.message });
    }
});

/* 
** Get User Task of current day **
API URL: localhost:3000/api/task/1
Method : GET,
Header : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpZGVudGlmaWVyIjoiNTQyZCEiLCJpYXQiOjE2MTc3Mjc2MDl9.kOD7cPZwW5JmKN-f1Jlp-g6HKIfIqgqZX92IEZBAjk8"
*/
router.get("/:user_id", Authenciation, async (req, res) => {
    try {
        if (req.params.user_id == 0) {
            res.status(404).json({ "status": 0, "message": global_string.user_not_found });
        } else {
            let data = await sqldb.tasks.findAll({
                where: sqldb.sequelize.and( sqldb.sequelize.where(sqldb.sequelize.fn('DATE_FORMAT', sqldb.sequelize.col('created_date'), '%Y-%m-%d'),  moment(new Date).format("YYYY-MM-DD") ), {is_deleted: 0, user_id: req.params.user_id }),
                attributes : ["task_id", "task_name", "description", "user_id", "created_date", "is_completed", "date_of_completion"],
                order: ["task_id"]
            });

            res.status(200).json({ "status": 1, "data": data });
        }
    } catch (e) {
        res.json({ "status": 0, "message": e.message });
    }
});

module.exports = router;