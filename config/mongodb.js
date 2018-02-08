const mongoose  = require('mongoose');

//Map global promises
mongoose.Promise = global.Promise; 

//Connect to mongoose 
mongoose.connect('mongodb://localhost/alteri', {})
    .then(() => console.log('MongoDB connected...'))
    .catch( err => console.log(err)); 
