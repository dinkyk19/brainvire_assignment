const sqldb = require("../models");
const jwt = require('jsonwebtoken');

async function Authenticate(req, res, next) {
    try{
        if (req.headers.authorization) {
            var auth = req.headers.authorization.toString().split(" ");
            var decoded = jwt.verify(auth[1], process.env.JWT_SECRET);
            if (decoded.identifier == "542d!") {
                if (decoded.user_id) {
                    let data = await sqldb.users.findOne({
                        where: { user_id: decoded.user_id, is_deleted: 0 },
                        attributes: ["user_id"]
                    });
                    if(data){
                        next();
                    }else{
                        res.json({ "res": 0, "message": "Your session is expire. Please login again." });
                    }
                }else{
                    res.json({ "res": 0, "message": "Your session is expire. Please login again." });
                }
            } else {
                res.json({ "res": 0, "message": "Your session is expire. Please login again." });
            }
        } else {
            res.json({ "res": 0, "message": "Please provide Authenciation information." });
        }
    }catch(e){
        res.json({ "res": 0, "message": "Please provide Authenciation information." });
    }
}


module.exports = Authenticate;