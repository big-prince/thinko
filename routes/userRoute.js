const express = require('express');
const router = express.Router();
const userController = require('../controllers/authController')
const authToken = require('../auth');  
const verify = require('../joi')


//home route
router.get('/', userController.home);
//login route
router.post('/login', verify.loginValidator, userController.login)
//signup route
router.post('/signup',verify.validateSignup,  userController.signup)
//logout route
router.get('/logout', userController.logout)
//dashboard route
router.get('/home', authToken.authenticateToken, userController.dashboard)
//quiz score route
router.post('/scores', authToken.authenticateToken, userController.quizScores)
//new quiz route
router.post('/newquiz', authToken.authenticateToken, userController.newQuiz)
//questions
router.post('/questions', authToken.authenticateToken, userController.questions);
//fetch quiz 
router.post('/quiz', authToken.authenticateToken, userController.sendQuiz)
//receive answers
router.post('/answer', authToken.authenticateToken, userController.scoreHandler)
//delete quizzes
router.post('/delete', authToken.authenticateToken, userController.deleteQuiz)
//post search route
router.post('/search', authToken.authenticateToken, userController.search)



module.exports = router