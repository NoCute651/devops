const db = require('../dbClient');

module.exports = {
    create: (user, callback) => {
        // Check parameters
        if (!user.username) 
            return callback(new Error("Wrong user parameters"), null);

        // Create User schema
        const userObj = {
            firstname: user.firstname,
            lastname: user.lastname,
        };

        // Save to DB
        db.hmset(user.username, userObj, (err, res) => {
            if (err) return callback(err, null);
            callback(null, res);
        });
    },

    get: (username, callback) => {
        // Check if username is provided
        if (!username) 
            return callback(new Error("Username is required"), null);

        // Retrieve user from DB
        db.hgetall(username, (err, user) => {
            if (err) return callback(err, null);
            if (!user) return callback(new Error("User not found"), null);
            callback(null, user);
        });
    }
};