const express = require( 'express' );
const workoutRouter = express.Router();
workoutRouter.use( express.json() );
const cookieParser = require('cookie-parser')
workoutRouter.use(cookieParser());

const {TokenMiddleware, generateToken, removeToken} = require('../model/middleware/TokenMiddleware');
const WorkoutDAO = require('../model/DAO/workoutDAO');

// Get workout element by id
workoutRouter.get( '/:workoutId', TokenMiddleware, ( req, res ) => {
    const workoutId = req.params.workoutId;
    if( req ) {
        WorkoutDAO.getWorkoutsById(workoutId).then(workout => {
            let result = {
                workout: workout
            }
            res.json(result);
        }).catch(err => {
            res.status(400).json({error: err});
        });
    }
});

// Get workout element by user
workoutRouter.get( '/', TokenMiddleware, ( req, res ) => {
    if(req.user) {
        WorkoutDAO.getWorkoutsByUser(req.user.id).then(workouts => {
            let result = {
                user: req.user.userId,
                workouts: workouts
            }
            res.json(result);
        }).catch(err => {
            res.status(400).json({error: err});
        });
    }
});

// Edit a prexisting workout and return new object 
workoutRouter.put( '/:workoutId', TokenMiddleware, async ( req, res ) => {
    const workoutId = req.params.workoutId;
    if(req.body.id, req.body.name, req.body.date) {
        WorkoutDAO.updateWorkout(workoutId, req.body.name, req.body.date).then(updatedWorkout  => {
            let result = {
                workout: updatedWorkout[0] 
            }
            res.json(result);
    }).catch( err => {
        res.status(400).json({error: err})
    });
    }
    else {
        res.status(401).json({error: "Workout to edit not found"})
    }   
});

// Create a new workout and return object 
workoutRouter.post( '/', TokenMiddleware, ( req, res ) => {
    // Modified from =>  if(req.body.workoutId) {
    if(req.body && req.body.usr_id && req.body.name && req.body.date ) {
        WorkoutDAO.createWorkout(req.body.usr_id, req.body.name, req.body.date).then(workout => {
            let newWorkout = {
                workout: workout
            }
            
            res.json(newWorkout);
            
        }).catch(err => {
            res.status(400).json({error: err});
        });
    }
    else {
        res.status(401).json({error: 'Failed creating workout object'});
    }
});

// Delete object and return its values and valid status
workoutRouter.delete( '/:workoutId', TokenMiddleware, ( req, res ) => {
    if (req.params.workoutId) {

        WorkoutDAO.deleteWorkout(req.params.workoutId).then(() => {
            //should be the deleted workout object
                res.status(200).json({ message: 'Workout was deleted successfully'});
            })
            .catch((err) => {
                console.error('Error deleting workout:', err);
                res.status(500).json({ error: 'INTERNAL server error' });
            });
    } else {
        res.status(404).json({ error: 'Not found' });
    }
});

module.exports = workoutRouter;