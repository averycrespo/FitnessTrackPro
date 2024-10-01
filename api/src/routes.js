const express = require('express');
const router = express.Router();

const exerciseRouter = require( './exerciseAPI.js' );
const userRouter = require( './userAPI.js' );
const workoutRouter = require( './workoutAPI.js' );
const workoutItemRouter = require( './workoutItemAPI.js' );

router.use('/exercise', exerciseRouter);
router.use('/users', userRouter);
router.use('/workouts', workoutRouter);
router.use('/items', workoutItemRouter);

module.exports = router;