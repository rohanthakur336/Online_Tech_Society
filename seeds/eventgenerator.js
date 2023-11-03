const fs = require('fs');
const mongoose = require('mongoose');
const event= require('../models/event');

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

const sd = new Date('2020-01-01');
const ed = new Date('2023-12-31');

function getRandomDate(sd, ed) {
  const randomTime = sd.getTime() + Math.random() * (ed.getTime() - sd.getTime());

  const randomDate = new Date(randomTime);

  return randomDate;
}

const seedDB = async () => {
    await event.deleteMany({});
    for (let i = 0; i < 5; i++) {
        const even = new event({
            start_date:getRandomDate(sd,ed),
            end_date:getRandomDate(sd,ed),
            description:"random description here",
            venue:"random place",
            imageType: 'jpeg',
        })
        const imageBuffer = fs.readFileSync('public/images/ee.jpeg');
        even.img= imageBuffer;
        await even.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})



























