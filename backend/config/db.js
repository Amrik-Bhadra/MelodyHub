const mongoose = require('mongoose');

function connectDB(){
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(()=>{
        console.log(`Connected to MongoDB ✅`);
    }).catch((err)=>{
        console.error(`Mongodb connection error: ${err}`);
    })
}

module.exports = connectDB;