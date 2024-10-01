const db = require('../db/DBConnection');

async function updateExerciseBest(userId, exerciseName, best) {

    try {
        return await db.query('UPDATE exercise_bests SET best=? WHERE usr_id=? AND exercise_name=?', [best, userId, exerciseName]);
    } catch (error) {
        console.error("Query error:", error);
        throw error;
    }
}

async function addUserToBests(userId, exerciseName, best) {
    try {
        const record = await getUserBestByExercise(userId, exerciseName);
        // console.log(record);
        if(!record) {
            return await db.query('INSERT INTO exercise_bests VALUES (?, ?, ?)', [userId, exerciseName, best], (error, results, fields) => {
                let id = results.insertId;
                return id.replace('n', '');
            });
        } else {
            if(record.best < best) {
                return await updateExerciseBest(userId, exerciseName, best);
            }
        }
    } catch (error) {
        console.error("Query error:", error);
        throw error;
    }
}

async function getUserBests(userId) {
    try {
        const results = await db.query('SELECT * FROM exercise_bests WHERE usr_id=?', [userId], (error, results, fields) => {
            return results;
        });
        if (!results) {
            throw new Error("Error getting bests");
        }
        return results;
    } catch (error) {
        console.error("Query error:", error);
        throw error;
    }
}

async function getAllExercises() {
    try {
        const results = await db.query('SELECT * FROM exercise', (error, results, fields) => {
            return results;
        });
        if (!results) {
            throw new Error("No user found with the provided username");
        }
        return results;
    } catch (error) {
        console.error("Query error:", error);
        throw error;
    }
}

async function getExerciseById(id) {
    try {
        const results = await db.query('SELECT * FROM exercise WHERE exercise_id=?', [id], (error, results, fields) => {
            return results;
        });
        if (!results || results.length === 0) {
            throw new Error("No user found with the provided username");
        }
        return results[0];
    } catch (error) {
        console.error("Query error:", error);
        throw error;
    }
}

async function getUserBestByExercise(userId, exerciseName) {
    try {
        const results = await db.query('SELECT * FROM exercise_bests WHERE usr_id=? AND exercise_name=?', [userId, exerciseName], (error, results, fields) => {
            return results;
        });
        if (!results || results.length === 0) {
            return null;
        }
        return results[0];
    } catch (error) {
        console.error("Query error:", error);
        throw error;
    }
}

module.exports = {
    updateExerciseBest,
    addUserToBests,
    getUserBests,
    getAllExercises,
    getExerciseById,
    getUserBestByExercise
}