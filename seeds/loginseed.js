const mongoose = require('mongoose');
const login= require('../models/login');

mongoose.connect('mongodb+srv://shivam:shivam28@project1.kja17z2.mongodb.net/society', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
        const log = new login({
            username:"RandomPerson3",
            password:"random2786",
            role:"someonespecial"
        })
        await log.save();
}

seedDB().then(() => {
    mongoose.connection.close();
})



























