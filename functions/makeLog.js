const Log = require("../models/Log");

exports.makeLog = (name, email, action) =>{
    return new Promise( async ( succ, error ) => {
        try {
            let log = new Log();
            log.name = name;
            log.email = email;
            log.action = action;
            await log.save();
            succ();
        } catch (error) {
            error();
        }
    });
};