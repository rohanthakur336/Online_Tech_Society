const express=require('express');
const app=express();
const path=require('path');

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.get('/society',(req,res)=>{
    res.render('home')
})

app.listen(3000,()=>{
    console.log('Servering on the port 3000')
})