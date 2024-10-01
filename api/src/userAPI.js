const express = require( 'express' );
const cookieParser = require('cookie-parser')

const userRouter = express.Router();

userRouter.use( express.json() );
userRouter.use(cookieParser())


const {TokenMiddleware, generateToken, removeToken} = require('../model/middleware/TokenMiddleware');
const UserDAO = require('../model/DAO/userDAO');

userRouter.post('/', (req, res) => {
    UserDAO.addUser(req.body.username, req.body.password)
    .then(insertId => {
        // console.log(insertId);
        return res.json({ insertId: insertId.toString(), redirectUrl: '/login' });
    }) 
    .catch((error) => {
        console.log(error);
        res.status(403).json({error: "error"});
    });
})

userRouter.post('/login', (req,  res) => {
    if(req.body.username && req.body.password) {
        UserDAO.login(req.body.username, req.body.password).then(user => {
            let result = {
                user: user
              }
              generateToken(req, res, user);
              res.json(result);
        }).catch(err => {
            res.status(405).json({error: err});
        });
    }
    else {
        res.status(401).json({error: 'Not authenticated'});
    }
});
  
userRouter.post('/logout', (req,  res) => {
    removeToken(req, res);

    res.json({success: true});
});
  
  
userRouter.get('/current', TokenMiddleware, (req,  res) => {
    res.json(req.user);
});

module.exports = userRouter;