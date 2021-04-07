const express = require('express');
const router = express.Router();
const encrpyt_decrypt = require("./encryption");
const jwt = require('jsonwebtoken');
const sqldb = require("../models");
const Authenciation = require("./authentication");
const moment = require('moment');
const global_string = require("./globalstring");
/* 
** Registeration **
API URL: localhost:3000/api/register
Method : POST
Payload :{
    "email" : "dinky@yopmail.com",
    "password" : "1234",
    "first_name" : "Dinky",
    "last_name" : "Kapadia"
}
*/
router.post("/register", async (req, res) => {
    try {
        if (!req.body.email) {
            res.status(404).json({ "status": 0, "message":global_string.email_not_found });
        } else if (!req.body.password) {
            res.status(404).json({ "status": 0, "message": global_string.password_not_found });
        } else {

            let exist_user = await findByUser(req.body.email);
            if (exist_user) {
                throw new Error("User already exist.");
            } else {
                let insert_user = await sqldb.users.create({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    password: encrpyt_decrypt.encrypt(req.body.password)
                });

                res.status(200).json({ "status": 1, "message": "User has been register successfully." });
            }
        }
    } catch (e) {
        res.status(400).json({ "status": 0, "message": e.message });
    }
});

/* 
** LOGIN **
API URL: localhost:3000/api/login
Method : POST
Payload : {
    "email" : "dinky@yopmail.com",
    "password" : "1234"
    } 
*/
router.post('/login', async (req, res) => {
    try {
        if (!req.body.email) {
            res.status(404).json({ "status": 0, "message":global_string.email_not_found });
        } else if (!req.body.password) {
            res.status(404).json({ "status": 0, "message": global_string.password_not_found });
        } else {
            let user = await findByUser(req.body.email);
            if (user) {
                if (encrpyt_decrypt.decrypt(user.password) == req.body.password) {

                    let token = jwt.sign({
                        user_id: user.user_id,
                        identifier: "542d!"
                    }, process.env.JWT_SECRET);

                    user.password = encrpyt_decrypt.decrypt(user.password);
                    res.status(200).json({ "status": 1, "message": "Login successfully", "token": token, "data": user });
                } else {
                    throw new Error("Invalid password.");
                }
            } else {
                throw new Error("user doesn't exist.");
            }
        }
    } catch (e) {
        res.status(400).json({ "status": 0, "message": e.message });
    }
});

/* 
** All User record with task count and date range **
API URL: localhost:3000/api/getAllUserList
Method : POST,
Header : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpZGVudGlmaWVyIjoiNTQyZCEiLCJpYXQiOjE2MTc3Mjc2MDl9.kOD7cPZwW5JmKN-f1Jlp-g6HKIfIqgqZX92IEZBAjk8"
Payload : {
    "end_date" : "2021-04-04",
    "start_date" : "2021-04-03"
}
*/
router.post("/getAllUserList",Authenciation, async (req, res) => {
    try {
        let start_date = null, end_date = null;
        if (req.body.start_date) {
            start_date = req.body.start_date
        }

        if (req.body.end_date) {
            end_date = req.body.end_date;
        }
        let condition = "created_date != null";
        if (typeof req.body.start_date == "undefined" || req.body.start_date == '' || typeof req.body.end_date == "undefined" || req.body.end_date == '') {
            condition = 'DATE_FORMAT(created_date, "%Y-%m-%d") <= "' + moment(new Date()).format('YYYY-MM-DD') + '"'
        } else {
            condition = ' DATE_FORMAT(created_date, "%Y-%m-%d") >= "' + moment(req.body.start_date).format('YYYY-MM-DD') + '" and DATE_FORMAT(created_date, "%Y-%m-%d") <="' + moment(req.body.end_date).format('YYYY-MM-DD') + '"'
        }

        let user_data = await sqldb.users.findAll({
            where: { is_deleted: 0 },
            attributes: ["user_id", "first_name", "last_name", [sqldb.sequelize.literal('(select count(1) from tasks where user_id = `users`.`user_id` and ' + condition + ')'), "task_count"]],
        });
        res.status(200).json({ "status": 1, data: user_data })
    } catch (e) {
        res.status(400).json({ "status": 0, "message": e.message });
    }
});

// find user data using email address
async function findByUser(email) {
    try {
        let user = await sqldb.users.findOne({
            where: { email: email, is_deleted: 0 },
            attributes: ["user_id", "email", "first_name", "last_name", "password"]
        });
        return (user);
    } catch (e) {
        return Promise.reject(e);
    }
}

module.exports = router;