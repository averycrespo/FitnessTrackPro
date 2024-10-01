const db = require('../db/DBConnection');

async function createWorkoutItem(workoutId, exerciseName, sets, reps, weight) {
    try {
        return await db.query(
            'INSERT INTO workout_item (workout_id, exercise_name, sets, reps, weight) VALUES (?, ?, ?, ?, ?)',
            [workoutId, exerciseName, sets, reps, weight], (error, results, fields) => {
                let id = results.insertId;
                return id.replace('n', '');
            });
    } catch (error) {
        console.error("Query error:", error);
        throw error;
    }
}

async function removeWorkoutItem(itemId) {
    try {
        return await db.query('DELETE FROM workout_item WHERE item_id=?', [itemId]);
    } catch (error) {
        console.error("Query error:", error);
        throw error;
    }
}

async function removeItemsByWorkout(workoutId) {
    try {
        return await db.query('DELETE FROM workout_item WHERE workout_id=?', [workoutId]);
    } catch (error) {
        console.error("Query error:", error);
        throw error;
    }
}

async function getItemsByWorkout(workoutId) {
    try {
        const results = await db.query('SELECT * FROM workout_item WHERE workout_id=?', [workoutId],
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

async function getItemById(itemId) {
    try {
        const results = await db.query('SELECT * FROM workout_item WHERE item_id=?', [itemId],
        (error, results, fields) => {
            return results;
        });
        if (!results) {
            throw new Error("No user found with the provided username");
        }
        return results[0];
    } catch (error) {
        console.error("Query error:", error);
        throw error;
    }
    }

function updateItem(itemId, exerciseName, sets, reps, weight) {
    try {
        return db.query('UPDATE workout_item SET exercise_name=?, sets=?, reps=?, weight=? WHERE item_id=?',
            [exerciseName, sets, reps, weight, itemId]);
    } catch (error) {
        console.error("Query error:", error);
        throw error;
    }
}

module.exports = {
    createWorkoutItem,
    removeWorkoutItem,
    removeItemsByWorkout,
    getItemsByWorkout,
    getItemById,
    updateItem
}