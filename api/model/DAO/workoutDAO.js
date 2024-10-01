const db = require('../db/DBConnection');

async function createWorkout(userId, name, date, callback) {
    db.query(
        'INSERT INTO workouts (usr_id, workout_name, workout_date) VALUES (?, ?, ?)',
        [userId, name, date],
        (error, results, fields) => {
            if (error) {
                console.error('Query error:', error);
                callback(error, null); // Pass the error to the callback
            } else {
                let id = results.insertId.toString().replace('n', '');
                // console.log('New workout ID:', id);
                callback(null, id); // Pass the new workout ID to the callback
            }
        }
    );
}

async function deleteWorkout(workoutId) {
    try {
        return await db.query('DELETE FROM workout_item WHERE workout_id=?', [workoutId]).then(() => {
            db.query('DELETE FROM workouts WHERE workout_id=?', [workoutId]);
        })
    } catch (error) {
        console.error("Query error:", error);
        throw error;
    }
}

async function getWorkoutsByUser(userId) {
    try {
        const results = await db.query('SELECT * FROM workouts WHERE usr_id=?', [userId],
        (error, results, fields) => {
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

async function getWorkoutsById(workoutId) {
    try {
        const results = await db.query('SELECT * FROM workouts WHERE workout_id=?', [workoutId],
        (error, results, fields) => {
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

async function updateWorkout(workoutId, name, date) {
    try {
        const results = await db.query('UPDATE workouts SET workout_name=?, workout_date=? WHERE workout_id=?', [name, date, workoutId],
        (error, results, fields) => {
                return results;
        });
        if (!results || results.affectedRows === 0) {
            throw new Error("No rows affected. Workout not updated.");
        }
        return results;
    } catch (error) {
        console.error("Query error:", error);
        throw error;
    }
}

module.exports = {
    createWorkout,
    deleteWorkout,
    getWorkoutsByUser,
    getWorkoutsById,
    updateWorkout
}