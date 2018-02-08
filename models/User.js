const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 
const bcrypt = require('bcryptjs'); 

const Voteschema = new Schema({
    votedFor : String
}); 

const UserSchema = new Schema({
    name : {
        type: String, 
        required: true
    },
    email : {
        type: String, 
        required: true
    },
    password : {
        type: String, 
        required: true
    },
    votes: [ Voteschema ],  
    voted: { 
        type: Boolean, 
        required: false
    },   
    date: {
        type: Date, 
        default: Date.now
    }
});

UserSchema.methods.encryptPassword = (password) => {
    return  bcrypt.hashSync(password, bcrypt.genSaltSync(5), null); 
}; 

UserSchema.methods.validPassword = function(password){
    console.log("User" + password);
    console.log("User" + this.password);
    return bcrypt.compareSync(password, this.password); 
}; 

mongoose.model('User', UserSchema ); 