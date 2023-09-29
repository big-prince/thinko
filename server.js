const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const cors = require('cors');
const ejs = require('ejs');
const mongoose = require('mongoose');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const app = express();

//dotenv
dotenv.config({path: 'config.env'});

//middleware
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SECRET_KEY, // Replace with a secure secret key
    resave: false,
    saveUninitialized: true
  }));
app.use(cors());
app.use(flash())



//using views
app.set('view engine', 'ejs');


//routes
const userRoute = require('./routes/userRoute');
app.use('/',userRoute );

//database connection
const connDB = async ()=>{
  try {
    const conn = await mongoose.connect(process.env.DATABASE);
    console.log('MongoDB connected')
  } catch (error) {
    console.log('MongoDB not connected.', error)
  }
}




const port = process.env.port || 3000
connDB().then(
  app.listen(port, ()=>{
      console.log('listening for requests')
  })
).catch('NO internet connection..')