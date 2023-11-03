const express=require('express');
const multer = require('multer');
const app=express();
const fs = require('fs');
const mongoose=require('mongoose');
const ejsMate=require('ejs-mate');
const path=require('path');
const Gallery=require('./models/gallery');
const methodOverride=require('method-override');
const {GallerySchema}=require('./schemas/galleryschema.js');
const {eventSchema}=require('./schemas/eventschema');
const event = require('./models/event');
const member = require('./models/member');

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

app.use(express.urlencoded())
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'))

app.engine('ejs', ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.get('/society',async(req,res)=>{
    res.render('home')
})

app.get('/society/login',(req,res)=>{
    res.render('login_page')
})

app.get('/society/gallery',async (req,res)=>{
    const gallerys=await Gallery.find({});
    res.render('gallery',{gallerys})
})

app.get('/society/events',async (req,res)=>{
    const events=await event.find({});
    res.render('event/event',{events});
})

app.get('/society/events/new',(req,res)=>{
    res.render('event/new');
})

app.post('/society/events',upload.single('event[img]'),async(req,res)=>{
    const even = new event(req.body.event);
    even.img=req.file.buffer
    await even.save();
    res.redirect('/society/events');
})

app.get('/society/community',(req,res)=>{
    res.send('community')
})

app.get('/society/joinus',(req,res)=>{
    res.render('joinUs')
})

app.get('/society/members',async(req,res)=>{
    const members=await member.find({});
    res.render('members',{members});
})

app.listen(5000,()=>{
    console.log('Servering on the port 5000')
})