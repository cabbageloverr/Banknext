const mongoose = require('mongoose');

const { MONGO_URI } = process.env;

exports.connect = () => {
    mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        
    })
    .then(() => {
        console.log("Succesfully connected to database");
    })
    .catch((error) => {
        console.log("Error");
        console.error(error);
        process.exit(1);
    });
}