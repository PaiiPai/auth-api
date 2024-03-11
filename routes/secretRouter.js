const { Router } = require('express');
const secret_get = require('../controller/secretController');
const secretRouter = Router();

secretRouter.get('/secret', secret_get);
secretRouter.get('/secrets');

module.exports = secretRouter;