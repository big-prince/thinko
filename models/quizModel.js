const mongoose = require('mongoose');


const quizSchema = mongoose.Schema({
    quizName: {
        type: String
    },
    questions: {
        type: String
    },
    option1: {
        type: String
    },
    option2: {
        type: String
    },
    option3: {
        type: String
    },
    option4: {
        type: String
    },
    answer: {
        type: String
    }
})

module.exports = new mongoose.model('Quiz', quizSchema)