const db = require('../db/DBConnection');
const user = require('../models/user');
const crypto = require('crypto');

async function login(username, password) {
    try {
        const results = await db.query("SELECT * FROM user WHERE username = ?", [username],
        (error, results, fields) => {
            return results;
        });

        if (!results || results.length === 0) {
            throw new Error("No user found with the provided username");
        }

        const user = results[0];
        // console.log(user);

        return new Promise((resolve, reject) => {
            crypto.pbkdf2(password, user.usr_salt, 100000, 64, 'sha512', (err, derivedKey) => {
                if (err) {
                    reject({ code: 400, message: 'Error: ' + err });
                }

                const digest = derivedKey.toString('hex');
                // console.log(user);
                // console.log(digest);
                // console.log('input password', password);
                // console.log('digest', digest);
                // console.log('user', user);
                if (user.usr_password === digest) {
                    resolve(getFilteredUser(user));
                } else {
                    reject({ code: 401, message: 'Invalid username or password' });
                }
            });
        });
    } catch (error) {
        console.error("Query error:", error);
        throw error;
    }
}

async function addUser(username, password) {
    try {
        const results = await db.query('SELECT * FROM user WHERE username=?', [username],
        (error, results, fields) => {
            return results;
        });
        //NEED TO DISPLAY TOAST FOR ERROR
        if (results && results.length > 0) {
            throw new Error("Username Taken");
        }

        // Generate salt and hash the password
        let salt = crypto.randomBytes(32).toString('hex');
        let pass = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString("hex");

        // Insert the new user into the database
        const { insertId } = await db.query('INSERT INTO user (username, usr_password, usr_salt) VALUES (?, ?, ?)', [username, pass, salt]);
        
        return insertId.toString();
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    login: login,
    addUser: addUser
  };
  
  function getFilteredUser(user) {
    return {
      "id": user.usr_id,
      "username": user.username
    }
  }