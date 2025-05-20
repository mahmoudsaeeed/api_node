const express = require('express');
const router = express.Router();
const controller = require('../../controllers/users_controller');
const authunticateToken = require('../../middleware/auth_middleware');
const endPoints = require('../endpoints');


router.post(endPoints.loginEndPoint, controller.login );

router.post(endPoints.signupEndPoint, controller.signup);

// router.get(endPoints.usersEndPoint, authunticateToken ,controller.getUsers)



module.exports = router;
