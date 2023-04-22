const User = require('../models/User');
const Task = require('../models/Task');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//for add a task
module.exports.addTask = async function (req, res) {

    try {

        const { title, description, status } = req.body;
        // Finds the validation errors in this request 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let task = await Task.create({
            title,
            description,
            status,
            user :req.user.id
        });

        //find user id in User Collection 
        let user = await User.findById(req.user.id);
        user.task.push(task);
        user.save();
        res.status(200).json({ task });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }

}

// edit task
module.exports.editTask = async function (req, res) {

    try {
        const { title, description, status } = req.body;
    //creat a newTask object
    const newTask = {};
    if (title) { newTask.title = title };
    if (description) { newTask.description = description };
    if (status) { newTask.status = status };

    //Find the task to be updated and update it
    let task = await Task.findById(req.params.id);
    if (!task) {
        return res.status(404).send("Not Found")
    }

    if (task.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
    }

    task = await Task.findByIdAndUpdate(req.params.id, { $set: newTask }, { new: true })
    res.status(200).json({ task });
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
    
}

//for delete task
module.exports.deleteTask = async function (req, res) {

    try {
        //Find the task for delete 
        let task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).send("Not Found")
        }

        //check user id who is login and whose task.
        if (task.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        let userId = task.user;

        task = await Task.findByIdAndDelete(req.params.id)

        //find user id in User collection move to review array and delete 
        let user = await User.findByIdAndUpdate(userId, { $pull: { task: req.params.id } });

        res.json({ "Success": "Task has been deleted", task: task });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error");
    }
}




