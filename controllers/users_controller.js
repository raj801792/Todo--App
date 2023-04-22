const User = require('../models/User');
const Task = require('../models/Task');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// for sign in 
module.exports.signIn = async function (req, res) {

    //if validation error are occure
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    //destructcharing email and password from req.body
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        //if email id are not find
        if (!user) {
            return res.status(400).json({ errors: 'enter the valid cradentioal' });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        //if password are not match
        if (!passwordCompare) {
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }


        //set data and signature in jwt token
        const data = {
            user: {
                id: user.id         
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
       

        //return status and authentication token
        return res.status(200).json({ authtoken});
       

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
}

// create a new user
module.exports.signUp = async function (req, res) {

    //if validation error are occure
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        //scarching email in database 
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ errors: 'email alredy exist' });
        }

        //creat salt and generate hasing of password
        let salt = await bcrypt.genSaltSync(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        //Creat a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        })

        //set data and signature in jwt token
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);

        //return status and authentication token
        return res.status(200).json({ user });
    } catch (error) {

        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

}

//for get the user details and fetch all task for a particular user
module.exports.getTask = async function (req, res) {

    try {
 
        //find user and fetch all task for a particular user who is login       
        let user = await User.findById(req.user.id);
        if (user) {
            const userDetails = await User.findById(req.user.id,"task").populate([{
                path: "task"
            },

            ]);
            
            return res.status(200).json({ userDetails }); 
        }
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
}




