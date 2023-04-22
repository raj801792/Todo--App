const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authenticat = require('../middleware/authenticat');
const usersController = require('../controllers/users_controller');

//Create a user using:POST "/api/user/sign-up". no login recoured
router.post('/sign-up',[
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 })
], usersController.signUp);


//User login:POST "/api/user/sign-in". no login recoured
router.post('/sign-in',[
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').exists(),
], usersController.signIn);

//get user details and task use:GET "/api/user/getTask". login recoured
router.get('/getTask', authenticat, usersController.getTask);


module.exports = router;