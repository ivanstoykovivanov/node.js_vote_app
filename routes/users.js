const express = require('express');
const router = express.Router(); 
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const passport = require('passport'); 
const flash = require('express-flash');
const session = require('express-session'); 
const async = require('async'); 
//Map global promises

//Load User model
require('../models/User'); 
require('../models/PersonalVote'); 
//get chart data :
let ctgs = require('../data/voteCategories')
let Chart = require('../data/Chart'); 


const User = mongoose.model('User');
const PersonalVote = mongoose.model('PersonalVote');

//VOTE
router.get('/vote',isLoggedIn,  (req, res, next) => {
    const title = "Welcome from app.get"; 
    
    //Fetch user data: 
    let user_id = req.session.newUser._id; 
    console.log(req.session.newUser.email); 
    console.log(user_id);
    
    //Check if the user has voted to display or NOT display the voting page
    const email = req.session.newUser.email; 
    User.findOne( { 'email' : email}, 'voted', (err, user) => {
        if(err){console.log(err);} 
        if(user){ 
            if(user.voted){ 
                console.log("User Voted");
                res.redirect( '/users/stats'); 
                //res.render('voted_already', {title : title });
            }else{
                console.log(ctgs.voteCtgs);     
                console.log("User HAS NOT Voted");
                res.render('votePage', {ctg : ctgs.voteCtgs }); 
            }
        }
    }); 
});

router.post('/vote', isLoggedIn, (req, res) => {
    const title = "Welcome from app.get"; 
        let actor = req.body.best_actor ; 
        let actress = req.body.best_actress ; 
        let best_performance = req.body.best_performance ; 
        
        //find by Id: 
        let user_id = req.session.newUser._id; 
        
        //Update the votes 
        User.findOneAndUpdate({_id: user_id}, 
            { votes : [{votedFor: actor}, {votedFor: actress}, {votedFor: best_performance}], voted: true }, (err, res) => {
            if(err){console.log(err); }
            if(res){ console.log("Updated:  " + res);
            }
        });

        res.render('results', {
            title : title, 
            actor: actor, 
            actress: actress, 
            best_performance: best_performance
        });
});

//STATS
router.get('/stats', (req, res) => {
    async function asyncForEach(array, callback){
        for (let index = 0; index < array.length; index++){
          await callback(array[index], index, array)
        }
    }

    const actressesArray = (Object.values(ctgs.voteCtgs.actress.nominees));//["Фасика", "Мирела", "Вал", "Петя" ];   
    const actorsArray = (Object.values(ctgs.voteCtgs.actor.nominees));//["Фасика", "Мирела", "Вал", "Петя" ];   
    
    async function getData(){
        const allVotes = [];  
        const votesActresses = []; 
        const namesActresses = []; 
        //actresses 
        await asyncForEach(actressesArray, async (actr) => {
            console.log('-----------Fetching votes-------------------');
            let votes = await User.count({ "votes.votedFor": actr.name });   
            console.log(actr.name);
            console.log(votes);
            votesActresses.push(votes);  
            namesActresses.push(actr.name);  
            console.log(actr.votes);
        })
        //actors
        const votesActors = []; 
        const namesActors = [];  
        await asyncForEach(actorsArray, async (actr) => {
            let votes = await User.count({ "votes.votedFor": actr.name });   
            console.log(actr.name);
            console.log(votes);
            votesActors.push(votes);  
            namesActors.push(actr.name);  
            console.log(actr.votes);
        })

        //console.log(data);
        console.log(namesActors);
        console.log(namesActors);
        console.log(namesActors);
        console.log('-----------End Votes-------------------');
        
        //  !!  RENDER !!
        res.render('stats/stats', {
            votesActresses : votesActresses,
            votesActors : votesActors,
            namesActors : encodeURIComponent(JSON.stringify(namesActors)), 
            namesActresses : encodeURIComponent(JSON.stringify(namesActresses))
        }) ; 
    }
    
    getData(); 
}); 


//APPLYING TO ALL ROUTES BELOW : 
router.use('/', notLoggedIn, (req, res, next) => {
    next(); 
})

//LOGIN 
router.get('/login', (req, res) => { 
    let messages = req.flash('error');
    res.render('users/login', {messages :  messages, hasErrors : messages.length > 0 }); 
});
router.post('/login', passport.authenticate('local.login', {
        successRedirect : '/users/vote', 
        failureRedirect: '/users/register', 
        failureFlash: true, 
    })
); 

//REGISTER
router.get('/register', (req, res) => {
    let messages = req.flash('error');
    req.flash('msg', 'Test'); 
    res.render('users/register', {messages : messages, hasErrors : messages.length > 0 }) ; 
}); 
router.post('/register', passport.authenticate('local.register', {
        successRedirect : '/users/vote', 
        failureRedirect: '/users/register', 
        failureFlash: true, 
    })
);

//LOGOUT
router.get('/logout', isLoggedIn,  (req, res)=> {
    req.logout(); 
    res.redirect('/users/login');
})

function notLoggedIn(req, res, next){
    if(!req.isAuthenticated()){
        return next()
    }
    //res.redirect('/users/login'); 
    res.redirect('/'); 
}

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    //res.redirect('/users/login'); 
    res.redirect('/'); 
}

module.exports = router ; 