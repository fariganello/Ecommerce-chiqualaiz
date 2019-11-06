const express = require ('express');
const bodyParser = require ('body-parser');
const morgan = require('morgan');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/index')
const session = require('express-session');
const passport = require('../back/config/passport')
const db = require('./config/db');

require('dotenv').config();

const app = express();

//.env
const PORT = process.env.PORT || 3000;

//Static files
app.use(express.static('public'));

//BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

//Morgan logger
app.use(morgan('dev'));

//Passport
app.use(session({ 
    secret: "omdb",
    resave: false,
    saveUninitialized: true
  }));
app.use(passport.initialize());
app.use(passport.session());

//Router
app.use('/', indexRouter);

db.sync()
.then(function(){
    app.listen(PORT, function(){
        console.log('Chiqualize listening on ' + PORT);
    })
})
.catch(err => console.error(err))

module.exports = app;