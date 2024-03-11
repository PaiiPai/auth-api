const express = require('express');
const userRouter = express.Router();
const { login_get, login_post, signup_get, signup_post, logout_get } = require('../controller/userController');

userRouter.get('/login', login_get);
userRouter.post('/login', login_post);
userRouter.get('/signup', signup_get);
userRouter.post('/signup', signup_post);
userRouter.get('/logout', logout_get);

module.exports = userRouter;