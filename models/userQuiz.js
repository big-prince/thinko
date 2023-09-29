const mongoose = require('mongoose');


const Schema = mongoose.Schema({
    username: {
        type: String
    },
    quiz: {
        name: {
            type: String
        },
        description: {
            type: String
        }
    }
});

module.exports = new mongoose.model('QUIZ', Schema);