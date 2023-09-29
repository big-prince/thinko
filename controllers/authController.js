const express = require('express');
const app = express();
const ejs = require('ejs');
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
//models
const User = require('../models/userModel');
const Quiz = require('../models/quizModel');
const QUIZ = require('../models/userQuiz');


exports.home = (req, res)=>{
    res.render('../views/index.ejs', { messages: req.flash('error') })
}

//login handler
exports.login = async (req, res)=>{
    try {
        //get credentials
        const {username, password}= req.body
        if(!username || !password){
            res.status(404).send('Credentials not found')
        }
        
        //check if user exists
        const user = await User.findOne({username: req.body.username})
        if(!user){
            console.log('User does not exist')
            return res.status(404).json({message: "user not found"})
        }

        //compare the password
        const passwordCorrect = await bcrypt.compare(password, user.password);
        if(!passwordCorrect){
            console.log("Incorrect password")
            res.status(300).json({message: "incorrect password"})
        }

        //if all good, create token
        const token = jwt.sign({username: user.username}, process.env.SECRET_KEY, {expiresIn: '1h'})

        // Set the token as an HTTP-only cookie
        res.cookie('token', token, { httpOnly: true });
        

        //store req.session
        req.session.user = {
            name: user.name,
            username: user.username
        }
        console.log(req.session.user.name)

        // If everything is fine, return the new user object
        console.log('Login successful');
        return res.status(200).json({ message: "login successful" });

    } catch (error) {
        console.error('Error in signup:', error);
        return error; // Pass the error to done
    }
}


//signup handler
exports.signup =  async (req, res) => {
    try {
        // Retrieve credentials
        const { name, username, password } = req.body;

        if (!name || !username || !password) {
            console.log('Credentials not found');
            return res.status(404).json({ message: 'Credentials not found' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Check if username exists
        const userExists = await User.findOne({ username });

        if (userExists) {
            console.log('User exists');
            return done(null, false, { message: 'Username is already taken' });
        }

        // Create a new user
        const user = new User({ username, name, password: hashedPassword });
        
        // Save the new user
        const savedUser = await user.save();

        console.log('User saved');

        //generate token
        const token = jwt.sign({username: user.username}, process.env.SECRET_KEY, {expiresIn: '1h'})

        // Set the token as an HTTP-only cookie
        res.cookie('token', token, { httpOnly: true });

        //store session data
        req.session.user = {
            name: savedUser.name,
            username: savedUser.username
        }


        // If everything is fine, return the new user object
        console.log('Signup successful');
        return res.status(200).json({ message: "Signup successful" });

    } catch (error) {
        console.error('Error in signup:', error);
        return error; // Pass the error to done
    }
}

//logout
exports.logout = (req, res)=>{
    res.clearCookie('token');
    res.status(200).redirect('/')
    console.log('logged out..');
}


let index = 0

let DQN 
let length


//send questions to frontend
exports.sendQuiz = async (req, res)=>{
    //load the quiz name
    const quizName = req.body
   
    index = 0
    try {
        let arrayQ = []
        let arrayA = []
        let arrayS = []
        
        // const ReceivedAnswer = req.body
        if(!quizName){
            console.log('Quiz name not received')
            return res.status(404).json({message: "data not found"})
        }
        //Load questions
        const Questions = await Quiz.find({quizName: quizName.quizName})
        if(!Questions){
            console.log('No data retrievable')
        }
        //map the questions
        const mapQuestions = Questions.map(question =>({
            question: question.questions,
            options: {
                option1: question.option1,
                option2: question.option2,
                option3: question.option3,
                option4: question.option4
            },
            answer: question.answer
        }))
    
        
        
        const questionForRendering = mapQuestions.forEach((question, index)=>{
           let sth = question.question
           let sth2 = question.options
           let sth3 = question.answer
           arrayQ.push(sth) 
           arrayA.push(sth2)
           arrayS.push(sth3)
        })
        length = arrayQ.length 
    
       
    
        //send to client
        res.status(200).json({
            quizName: quizName.quizName,
            question: arrayQ[index],
            questionLength: arrayQ.length,
            options: {
                option1: arrayA[index].option1,
                option2: arrayA[index].option2,
                option3: arrayA[index].option3,
                option4: arrayA[index].option4,
            }
        })
    } catch (error) {
        console.log('Quiz End')
    }


    DQN = quizName.quizName
    index = 0
}

//handle answers and scores
index = 0
answerArray = []
success = []
let arrayQ = []
let arrayA = []
let arrayS = []
answerArray.length = 0
exports.scoreHandler = async(req, res)=>{
    
    const answer = req.body
   //question length 
    const totalNumberQuestions = parseInt(length);
    //send answer to array
    answerArray.push(answer.answer)

    
    //crosscheck answer
    const allQuestions = await Quiz.find({quizName: DQN})
    const mapQuestions = allQuestions.map(question =>({
        answer: question.answer
    }))

    //check if answer is correct
    let strAnswer = String(answerArray[index])
    let strAnswer2 = String(mapQuestions[index].answer)

    console.log("strAnswer:", strAnswer);
    console.log("strAnswer2:", strAnswer2);

    if(strAnswer.trim() === strAnswer2.trim()){
        console.log('Correct')
        success.push('Correct')
    }else{
        console.log('Wrong')
    }



     //make sure index only adds according to question no
     if(!index >= totalNumberQuestions){
       //increment index
       console.log('Not greater')
     }
    index = index + 1
    
    try {
        let arrayQ = []
        let arrayA = []
        let arrayS = []
        
        //  //Load questions
        const Questions = await Quiz.find({quizName: DQN})
        if(!Questions){
            console.log('No data retrievable')
        }
        //map the questions
        const mapQuestions = Questions.map(question =>({
            question: question.questions,
            options: {
                option1: question.option1,
                option2: question.option2,
                option3: question.option3,
                option4: question.option4
            },
            answer: question.answer
        }))
    
        
        
        const questionForRendering = mapQuestions.forEach((question, index)=>{
           let sth = question.question
           let sth2 = question.options
           let sth3 = question.answer
           arrayQ.push(sth) 
           arrayA.push(sth2)
           arrayS.push(sth3)
        })
        try{
            if(index >= arrayQ.length){
                console.log('Exceeded number of questions')
                return res.status(200).json({message: 'Quiz Ended', success: success.length, totalQNo: arrayQ.length, quizName: DQN})
            }
        }catch(error){
            console.log('Error in index')
        }
        
        console.log(success.length)
        //send to client
        res.status(200).json({ message: {
            quizName: DQN,
            question: arrayQ[index],
            options: {
                option1: arrayA[index].option1,
                option2: arrayA[index].option2,
                option3: arrayA[index].option3,
                option4: arrayA[index].option4,
            }
        }
        })
    } catch (error) {
        answerArray.length = 0
        console.log('Quiz End')
    }
    
}

//dashboard
exports.dashboard = async(req, res)=>{
    //set the arrays to 0 length
    success.length = 0
    answerArray.length = 0
    try{
        const session = req.session.user
        //check if user exists
        const accountExists = await User.findOne({username: session.username})
        if(!accountExists){
            return res.status(400).send('User does not exist')
        }

        // fetch quiz for rendering
        const quizzes = await QUIZ.find({username: accountExists.username})
        .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
        .exec();
        //map data for rendering
        const quizForRendering = quizzes.map(quiz => ({
            name: quiz.quiz.name,
            description: quiz.quiz.description
        }))
        

        res.render('../views/home.ejs', {name: accountExists.name,
             username: accountExists.username,
             quizzes: quizForRendering,       
        })

    }catch(error) {
        const errorMessage = error
        console.log(errorMessage )
        res.redirect('/')
    }
}

//receive scores from frontend
exports.quizScores = async (req, res)=>{
    const {score, over, name, questions, options, answer} = req.body
    if(!score|| !over || !name || !answer){
        return res.status(404).send('Scores not received')
    }
    //stringify them
    let stringify1 = JSON.stringify(questions);
    let stringify2 = JSON.stringify(options);
    let stringify3 = JSON.stringify(answer)

    //total score
    const totalScore = `${score}/${over}`
    //find currently logged in user
    const session = req.session.user
    const findUser = await User.findOne({username: session.username})

    //create quiz and then save history
    const quizHistory = new Quiz({
        username: findUser.username,
        quiz: {
            name: name,
            questions: stringify1,
            options: stringify2,
            answer: stringify3,
            score: totalScore
        }
    })

    //save quiz to database
    try {
        await quizHistory.save()
        .then(console.log('Quiz saved'))
    } catch (error) {
        console.log('Unable to save quiz')
    }

    //add to session
    req.session.quizName = quizHistory.quiz.name
}


let CQN 
exports.newQuiz = async (req, res)=>{
    //recieve from frontend
    const {quizName, quizDescription} = req.body
   
    res.status(200).json('Recieved')
    //
     //find currently logged in user
    const session = req.session.user
    const findUser = await User.findOne({username: session.username})


    //check if quiz name already exists

    //save quiz to backend
    const newQuiz = new QUIZ({
        username: findUser.username,
        quiz: {
            name: quizName,
            description: quizDescription
        }
    });

    CQN = newQuiz.quiz.name

    

    //save to database 
    try {
        await newQuiz.save()
    } catch (error) {
        console.log('Error in saving...')
    }
    console.log(newQuiz)
}

//new questions and options
exports.questions = async (req, res)=>{
    const {questionName, option1, option2, option3, option4, answer} = req.body
     if(!questionName || !option1 || !option2 || !option3 || !option4 || !answer ){
        console.log('not received')
        return res.status(404).json(" Not Received")
    }
    console.log(CQN, "This is cqn")
    //check if answer in options
    if(answer === option1 || answer === option2 || answer === option3 || answer === option4){
        console.log('answer in options')
    }

    //check if question already exists
    const questionExists = await Quiz.findOne({questions: questionName})
    if(questionExists){
        console.log('Question Already exists')
    }   

    // find the username and append the questions to the quiz
    const currentUser = await User.findOne({username: req.session.user.username})

    //check for the user in the quiz database
    const currentQuiz = await QUIZ.findOne({username: currentUser.username}).sort({createdAt: -1})
    
    //append current quiz name to current quiz and save
    const saveQuestions = new Quiz({
        quizName: CQN,
        questions: questionName,
        option1: option1,
        option2: option2,
        option3: option3,
        option4: option4,
        answer: answer
    })


    try {
        await saveQuestions.save()
        console.log('Quiz Saved')

    } catch (error) {
        console.log('Error in appending and saving..')
    }
    
    //call the current creating quiz
    res.status(200).json({message: 'Questions Saved'})

}

//delete quiz
exports.deleteQuiz = async (req, res)=>{
    const {quizName} = req.body
    if(!quizName){
        console.log('Quiz name not received')
        return res.status(404).json({message: "data not found"})
    }
    //delete quiz
    const deleteQuiz = await QUIZ.findOneAndDelete({username: req.session.user.username, 'quiz.name': quizName})
    if(!deleteQuiz){
        console.log('Quiz not found')
    }
    console.log('Quiz deleted')
    res.status(200).json({message: 'Quiz deleted'})
}









index = 0

let DQN2
length
//unique Quiz
exports.uniqueQuiz = async (req, res)=>{
   const quizName = req.params.quizName;

   try {
    //find the quiz by database
    const quiz = await QUIZ.findOne({username: req.session.user.username, 'quiz.name': quizName})

    if(!quiz){
        console.log('Quiz not found')
    }

    //load questions
    const Questions = await Quiz.find({quizName: quizName})
    if(!Questions){
        console.log('No data retrievable')
    }

    //map the questions
    const mapQuestions = Questions.map(question =>({
        question: question.questions,
        options: {
            option1: question.option1,
            option2: question.option2,
            option3: question.option3,
            option4: question.option4
        },
        answer: question.answer
    }))

    console.log(mapQuestions)
    
    const questionForRendering = mapQuestions.forEach((question, index)=>{
       let sth = question.question
       let sth2 = question.options
       let sth3 = question.answer
       arrayQ.push(sth) 
       arrayA.push(sth2)
       arrayS.push(sth3)
    })
    length = arrayQ.length 

   //render the unique quiz page based on Quiz and questions
   res.render('../views/uniqueQuiz.ejs', {
         quizName: quizName,
         question: questionForRendering[index].sth,
         questionLength: arrayQ.length,
         options: {
              option1: arrayA[index].option1,
              option2: arrayA[index].option2,
              option3: arrayA[index].option3,
              option4: arrayA[index].option4,
         }
   })

   
   DQN2 = quizName.quizName
   index = 0
   } catch (error) {
    console.log('Error in finding quiz')
    console.log(error)
   }
}

exports.uniqueScoreHandler = async (req, res)=>{
     
    const answer = req.body
   //question length 
    const totalNumberQuestions = parseInt(length);
    //send answer to array
    answerArray.push(answer.answer)

    
    //crosscheck answer
    const allQuestions = await Quiz.find({quizName: DQN})
    const mapQuestions = allQuestions.map(question =>({
        answer: question.answer
    }))

    //check if answer is correct
    let strAnswer = String(answerArray[index])
    let strAnswer2 = String(mapQuestions[index].answer)

    console.log("strAnswer:", strAnswer);
    console.log("strAnswer2:", strAnswer2);

    if(strAnswer.trim() === strAnswer2.trim()){
        console.log('Correct')
        success.push('Correct')
    }else{
        console.log('Wrong')
    }



     //make sure index only adds according to question no
     if(!index >= totalNumberQuestions){
       //increment index
       console.log('Not greater')
     }
    index = index + 1
    
    try {
        let arrayQ = []
        let arrayA = []
        let arrayS = []
        
        //  //Load questions
        const Questions = await Quiz.find({quizName: DQN})
        if(!Questions){
            console.log('No data retrievable')
        }
        //map the questions
        const mapQuestions = Questions.map(question =>({
            question: question.questions,
            options: {
                option1: question.option1,
                option2: question.option2,
                option3: question.option3,
                option4: question.option4
            },
            answer: question.answer
        }))
    
        console.log(mapQuestions)
        
        const questionForRendering = mapQuestions.forEach((question, index)=>{
           let sth = question.question
           let sth2 = question.options
           let sth3 = question.answer
           arrayQ.push(sth) 
           arrayA.push(sth2)
           arrayS.push(sth3)
        })

        console.log(questionForRendering)
        try{
            if(index >= arrayQ.length){
                console.log('Exceeded number of questions')
                return res.status(200).json({message: 'Quiz Ended', success: success.length, totalQNo: arrayQ.length, quizName: DQN})
            }
        }catch(error){
            console.log('Error in index')
        }
        
        console.log(success.length)
        //send to client
        res.status(200).json({ message: {
            quizName: DQN,
            question: arrayQ[index],
            options: {
                option1: arrayA[index].option1,
                option2: arrayA[index].option2,
                option3: arrayA[index].option3,
                option4: arrayA[index].option4,
            }
        }
        })
    } catch (error) {
        answerArray.length = 0
        console.log('Quiz End')
    }
}

//search logic
exports.search = async (req, res)=>{
    const {search} = req.body
    if(!search){
        console.log('Search not received')
    }
    //find the quiz by database
    const quiz = await QUIZ.find({username: req.session.user.username, 'quiz.name': {$regex: new RegExp(search, 'i')}})
    if(!quiz){
        console.log('Quiz not found')
    }
    //send the quizNAme and description like others to the frontend
    //map quiz
    const mapQuiz = quiz.map(quiz =>({
        name: quiz.quiz.name,
        description: quiz.quiz.description
    }))

    //send to frontend
    res.status(200).json({message: mapQuiz})
    
}