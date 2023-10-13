const express=require('express');
const app=express();
const mongoose=require('mongoose');
// const ejsMate=require('ejs-mate');
const path=require('path');
// const Gallery=require('./models/gallery')
const methodOverride=require('method-override');
// const {GallerySchema}=require('./schemas.js');

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
app.use(methodOverride('_method'))

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.get('/society',(req,res)=>{
    res.render('home')
})

app.get('/society/login',(req,res)=>{
    res.render('login_page')
})

app.get('/society/gallery',(req,res)=>{
    res.render('gallery')
})

app.get('/society/events',(req,res)=>{
    res.send('events')
})

app.get('/society/community',(req,res)=>{
    res.send('community')
})

app.get('/society/joinus',(req,res)=>{
    res.render('joinUs')
})

app.get('/society/members',(req,res)=>{
    res.render('members')
})

app.listen(3000,()=>{
    console.log('Servering on the port 3000')
})