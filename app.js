const express=require('express');
const app=express();
const path=require('path');

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.get('/society',(req,res)=>{
    res.render('home')
})

app.get('/society/login',(req,res)=>{
    res.render('login_page')
})

app.get('/society/gallery',(req,res)=>{
    res.send('gallery')
})

app.get('/society/events',(req,res)=>{
    res.send('events')
})

app.get('/society/community',(req,res)=>{
    res.send('community')
})

app.get('/society/joinus',(req,res)=>{
    res.send('join us')
})



app.listen(3000,()=>{
    console.log('Servering on the port 3000')
})