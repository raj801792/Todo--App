const express = require('express')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authenticat = require('../middleware/authenticat');
const tasksController = require('../controllers/tasks_controller');


//Route1:add a task:POST "/api/task/addtask".  login recoured
router.post('/addtask', authenticat, [
    body('title', 'Enter a title').isLength({ min: 3 }),
    body('description', 'Descriptiona at least 6 character').isLength({ min: 6 }),
    body('status', 'status at least 6 character').isLength({ min: 6 })
], tasksController.addTask);

//route:2 Update an existing Task using: PUT"/api/task/updatetask/:id". login required
router.put('/updatetask/:id', authenticat, tasksController.editTask);

//route:3 delete an existing Task using: DELETE"/api/tsk/deletetask/:id". login required
router.delete('/deletetask/:id', authenticat, tasksController.deleteTask);

module.exports = router