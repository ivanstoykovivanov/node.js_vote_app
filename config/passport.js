const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = mongoose.model('User');
 
// const validator = require('express-validator'); 
// const { check, validationResult } = require('express-validator/check');
// const { matchedData, sanitize } = require('express-validator/filter');

passport.serializeUser( (user, done) => {
    done(null, user.id); 
}); 

passport.deserializeUser( (id, done) => {
    User.findById(id, (err, user) => { 
        done(err, user); 
    });  
});

passport.use('local.register', new LocalStrategy({
        usernameField: 'email', 
        passwordFiled: 'password', 
        passReqToCallback: true
    }, (req, email, password, done)=>{  
        //Validate with express-validator
        const name = req.body.name; 
        req.check('email', 'Invalid email' ).notEmpty().isEmail(); 
        req.check( 'password', 'Passwords must be at least 5 chars long and contain one number')
            .isLength({ min: 5 })
            .matches(/\d/); 
        req.check( 'name', 'Name should be at least 1 character long')
            .isLength({ min: 1 });
        const errors = req.validationErrors(); 
        if(errors){
            let messages = [];
            errors.forEach(err => messages.push(err.msg)); 
            return done(null, false , req.flash('error', messages), {name : name}) 
        };
        User.findOne({'email': email}, (err, user)=>{
            if( err ){ return done }; 
            if( user ){ 
                return done(null, false, {message : 'Email is already in use.'});
            }
        const newUser = new User(); 
        newUser.name = req.body.name; 
        newUser.email= email; 
        newUser.password = newUser.encryptPassword(password);
        newUser.votes = [{votedFor : "Georgi Arsov"}, {votedFor : "Fassika Melaku"}]; 
        newUser.save((err, result) => {
            if(err){ 
                console.log("error saving" + error);
                return done
            }; 
            req.session.newUser = newUser; 
            console.log("saved successfully     " + result );
            return done(null, newUser); 
        }) 
        }); 
    }
));  

passport.use('local.login', new LocalStrategy({
    usernameField: 'email', 
    passwordFiled: 'password', 
    passReqToCallback: true
}, (req, email, password, done)=>{  
    //validate fields
    req.check('email', 'Invalid email' ).notEmpty().isEmail(); 
    req.check( 'password', 'Passwords must be at least 5 chars long and contain one number').notEmpty(); 
    const errors = req.validationErrors(); 
    if(errors){
        let messages = [];
        errors.forEach(err => messages.push(err.msg)); 
        return done(null, false , req.flash('error', messages)) 
    };
    User.findOne({'email': email}, (err, user)=>{
        if( err ){ return done }; 
        if( !user ){ 
            return done(null, false, {message : 'No user found'});
        }else{
            console.log(user.name);
        }
        if(!user.validPassword(password)){
            console.log(password);
            console.log(user.password);
            return done(null, false, {message : 'Wrong password'});
        }
        req.session.newUser = user; 
        return done(null, user);
    }) 
}) 
);  

module.exports = function(passport){}
