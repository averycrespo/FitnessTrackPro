const express = require( 'express' );
const cookieParser = require('cookie-parser');
const exerciseRouter = express.Router();
exerciseRouter.use( express.json() );
exerciseRouter.use(cookieParser());


const {TokenMiddleware, generateToken, removeToken} = require('../model/middleware/TokenMiddleware');
const ExerciseDAO = require('../model/DAO/exerciseDAO');

//updates execise best
exerciseRouter.patch( '/:exerciseId/users/:userId', TokenMiddleware, (req, res) => {
    ExerciseDAO.getUserBestByExercise(req.params.userId, req.params.exerciseId).then(obj => {
        if(obj.best < parseInt(req.body.best)) {
            ExerciseDAO.updateExerciseBest(req.params.userId, req.params.exerciseId, parseInt(req.body.best)).then(() => {
                return res.json({"result": "success"});
            });
        }
    })   
});

exerciseRouter.post( '/', TokenMiddleware, (req, res) => {
    return ExerciseDAO.addUserToBests(req.body.userId, req.body.exerciseName, req.body.best);
})

//Retrieves all exercises
exerciseRouter.get( '/', TokenMiddleware, (req, res) => {
    ExerciseDAO.getAllExercises().then(obj => {
        let allExercises = {
            exercise: obj
        }
        res.json(allExercises); 
    });
});

//gets exercise by id
exerciseRouter.get( '/exercise/:exerciseId', TokenMiddleware, (req, res) => {
    if(req.body.exerciseId) {
        ExerciseDAO.getExerciseById(req.body.exerciseId).then(exercise => {
            let allExercises = {
                exercise: exercise
            }
            res.json(allExercises);
        }).catch(err => {
            res.status(400).json({error: err});
        });
    }
    else {
        res.status(401).json({error: "Error getting exercise"});
    }
});

//gets all exercises for a user
exerciseRouter.get( '/:usr_id', TokenMiddleware, (req, res) => {
    const usr_id = req.params.usr_id
    if(usr_id) {
        ExerciseDAO.getUserBests(usr_id).then(exercise => {
            let allExercises = {
                exercise: exercise
            }
            res.json(allExercises);
        }).catch(err => {
            res.status(400).json({error: err});
        });
    }
    else {
        res.status(401).json({error: "Error getting user's exercises"});
    }
});


module.exports = exerciseRouter;