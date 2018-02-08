const express = require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const validator = require('express-validator'); 
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

const app = express(); 

//Load routes
const users = require('./routes/users'); 
//const stats = require('./routes/stats'); 

//Passport Config 
require('./config/passport')(passport); 
//DB config
require('./config/mongodb'); 

//Connect to mongoose 
// mongoose.connect('mongodb://localhost/alteri', {
// })
// .then(() => console.log('MongoDB connected...'))
// .catch( err => console.log(err)); 

require('./config/passport'); 


//Handlebars middleware 
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//Body parses middleware 
app.use(bodyParser.urlencoded({ extended : false })); 
app.use(bodyParser.json())
app.use(validator()); 
// //Session
// app.use(session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: true }
//   }))
// app.use(flash()); 

app.use(cookieParser('secret'));
app.use(session({
    cookie: { maxAge: 60000 },
   // store: sessionStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}));
app.use(flash());

//Static Folder
app.use(express.static(path.join(__dirname, 'public'))); 

//Passport
app.use(passport.initialize());
app.use(passport.session());

//Use express-flash
app.use(flash())

app.use((req, res, next) => {
    res.locals.loggedIn = req.isAuthenticated(); 
    next(); 
}); 

//** ROUTES **// 
//Index  -MAIN VOTING PAGE
app.get('/', (req, res) => {
    const title = "Welcome from app.get"; 
    res.render('users/login', {title : title }) ; 
}); 

//RESULT PAGE
app.post('/results', 
    (req, res) => {
        let actor = req.body.best_actor ; 
        let actress = req.body.best_actress ; 
        let best_performance = req.body.best_performance ; 
        res.render('results', {
            actor: actor, 
            actress: actress, 
            best_performance: best_performance
        }) ; 
    }
); 

//Use routes
app.use('/users', users); 
//app.use('/stats', stats); 

app.listen(3000, () => console.log('Example app listening on port 3000'));