const express = require( 'express' );
const cookieParser = require('cookie-parser')

const workoutItemRouter = express.Router();

workoutItemRouter.use( express.json() );
workoutItemRouter.use(cookieParser());
const WorkoutItemDAO = require('../model/DAO/itemDAO');

const {TokenMiddleware, generateToken, removeToken} = require('../model/middleware/TokenMiddleware');

//creates new item
workoutItemRouter.post( '/', TokenMiddleware, (req, res) => {
    WorkoutItemDAO.createWorkoutItem(req.body.workoutId, req.body.exerciseName, req.body.sets, req.body.reps, req.body.weight)
    .then(insertId => {
        return res.json({ insertId: insertId.toString() });
    }) 
    .catch((error) => {
        console.log(error);
        res.status(403).json({error: "error"});
    });
})

//this gets all workout items in the system for a user
workoutItemRouter.get( '/item/:userId', TokenMiddleware, (req, res) => {
    if(req.body.userId) {
        
    }
});

//this gets all workout items for a specific workout
workoutItemRouter.get( '/:workoutId/', TokenMiddleware, (req, res) => {
    let workoutId = req.params.workoutId
    if(workoutId) {
        WorkoutItemDAO.getItemsByWorkout( workoutId ).then(workout => {
            
            res.json(workout);
        }).catch(err => {
            res.status(400).json({error: err});
        });
    } 
});

//this gets an individual item by id
workoutItemRouter.get( '/item/:itemId', TokenMiddleware, (req, res) => {
    let id = req.params.itemId

    if( id ) {
        WorkoutItemDAO.getItemById(id).then(item => {
            
            res.json(item);
        }).catch(err => {
            res.status(400).json({error: err});
        });
    } 
});

//this edits a specific workout item
workoutItemRouter.put( '/item/:itemId', TokenMiddleware, (req, res) => {
    let id = req.params.itemId

    if(id) {
        //incorrect fix later
        WorkoutItemDAO.updateItem(req.params.itemId).then(item => {
            
            res.json(item);
        }).catch(err => {
            res.status(400).json({error: err});
        });
    } 
});

//this deletes a specfic exercise item
workoutItemRouter.delete( '/:itemId', TokenMiddleware, (req, res) => {
    let id = req.params.itemId;
    if( id ) {
        WorkoutItemDAO.removeWorkoutItem(id).then(item => {
            res.json(item);
        }).catch(err => {
            res.status(400).json({error: err});
        });
    }
});

workoutItemRouter.delete( '/workout/:workoutId', TokenMiddleware, (req, res) => {
    let id = req.params.workoutId;
    if( id ) {
        WorkoutItemDAO
            .removeItemsByWorkout(id)
            .then(res => {
                res.json({success: true});
            })
            .catch(err => {
                res.status(400).json({error: err});
            })
    }
})

module.exports = workoutItemRouter;