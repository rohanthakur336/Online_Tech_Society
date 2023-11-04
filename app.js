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
    res.render('gallery/gallery',{gallerys})
})

app.get('/society/gallery/new',(req,res)=>{
    res.render('gallery/new');
})

app.post('/society/gallery',upload.single('gallery[image]'),async(req,res)=>{
    const gal = new Gallery(req.body.gallery);
    gal.image=req.file.buffer
    await gal.save();
    res.redirect('/society/gallery');
})

app.delete('/society/gallery/:id', async(req,res)=>{
    const {id}= req.params
    await Gallery.findByIdAndDelete(id,{...req.body.Gallery})
    res.redirect(`/society/gallery`)
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

app.delete('/society/events/:id', async(req,res)=>{
    const {id}= req.params
    await event.findByIdAndDelete(id,{...req.body.event})
    res.redirect(`/society/events`)
})

// app.get('/society/events/:id/edit',async(req,res)=>{
//     const even=await event.findById(req.params.id)
//     res.render('event/update',{even});
// })

app.get('/society/community',(req,res)=>{
    res.send('community')
})

app.get('/society/joinus',(req,res)=>{
    res.render('joinUs')
})

app.get('/society/members',async(req,res)=>{
    const members=await member.find({});
    res.render('member/member',{members});
})

app.get('/society/members/new',(req,res)=>{
    res.render('member/new');
})

app.post('/society/members',upload.single('member[img]'),async(req,res)=>{
    const mem = new member(req.body.member);
    mem.img=req.file.buffer
    await mem.save();
    res.redirect('/society/members');
})

app.delete('/society/members/:id', async(req,res)=>{
    const {id}= req.params
    await member.findByIdAndDelete(id,{...req.body.member})
    res.redirect(`/society/members`)
})

app.listen(3000,()=>{
    console.log('Servering on the port 3000')
})