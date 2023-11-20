const mongoose = require('mongoose');
const anounce = require('../models/anouncement');


const seedDB = async () => {
    // await anounce.deleteMany({});
    await mongoose.connect('mongodb+srv://shivam:shivam28@project1.kja17z2.mongodb.net/society', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    const db = mongoose.connection;

    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", () => {
        console.log("Database connected");
    })
    const ann = new anounce({
        send_date: new Date(),
        to: "admin",
        from: "rohan",
        message: "template"
    })
    await ann.save();
}

seedDB().then(() => {
    mongoose.connection.close();
})