const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    // include the array of ids of all tasks in this post schema itself
    task: [
        {
            type:  mongoose.Schema.Types.ObjectId,
            ref: 'Task'
        }
    ]
}, {
    timestamps: true
});


const User = mongoose.model('User', userSchema);
module.exports = User;