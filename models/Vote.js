const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 

const VoteSchema = new Schema({
    votedFor : {
        type: String, 
        required: true
    }, 
    category  : {
        type: String , 
        required: true
    },
    user : {
        type: String , 
        required: true
    },        
});

mongoose.model('Vote', VoteSchema ); 


