const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 

const PersonalVoteSchema = new Schema({
    user : { 
        type: Schema.Types.ObjectId, 
        ref: 'Person' 
    },
    bestActor : {
        type: String, 
        required: true
    }, 
    bestActress : {
        type: String , 
        required: true
    },
    bestPerformance: {
        type: String , 
        required: true
    }
});

mongoose.model('PersonalVote', PersonalVoteSchema ); 