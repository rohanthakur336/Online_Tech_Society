const mongoose = require('mongoose');
const Gallery = require('../models/gallery');

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
    await Gallery.deleteMany({});
    // for (let i = 0; i < 50; i++) {
    //     const gall = new Gallery({
    //         image: `https://source.unsplash.com/random`,
    //         // date:"2023-12-11",
    //         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam magni voluptate odio ab, ducimus repellat deserunt ipsa. Atque eligendi cum voluptas iste quo provident similique porro aliquid dicta, impedit ipsam Aperiam delectus tempora laboriosam ex maiores deleniti id consectetur porro eius unde iste reprehenderit quis, enim suscipit distinctio quod rem, veniam, illo adipisci perferendis. Inventore laudantium vero ad aperiam consequatur."
    //     })
    //     await gall.save();
    // }
}

seedDB().then(() => {
    mongoose.connection.close();
})