const express=require('express');
const multer = require('multer');
const app=express();
const fs = require('fs');
const mongoose=require('mongoose');
const ejsMate=require('ejs-mate');
const path=require('path');
const Gallery=require('./models/gallery');
const methodOverride=require('method-override');
const event = require('./models/event');
const member = require('./models/member');
var bodyParser = require('body-parser')
const { isLoggedIn, isAdmin,isHeadorAdmin } = require('./middleware');
const User = require('./models/login'),
    passport = require("passport"),
    session = require("express-session"),
    flash = require("connect-flash");
    LocalStrategy  = require("passport-local");
require('dotenv').config();
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })


// const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

// mongoose.connect('mongodb+srv://shivam:shivam28@project1.kja17z2.mongodb.net/society', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
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
app.use(flash());
app.engine('ejs', ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const sessionConfig = {
    // store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
//passport configuration
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
  
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
  
  // pass currentUser to all routes
  app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }); 
app.post('/submit-form', upload.single('cv'), (req, res) => {
    try {
      // Extract form data from req.body
      const formData = req.body;
  
      // Check if req.file is defined
      if (req.file) {
        const cv = req.file;
  
        // Use nodemailer to send an email with the form data
        sendEmail(formData, cv);
  
        // Respond to the client
        res.send('Form submitted successfully!');
      } else {
        // Handle the case where no file is provided
        res.status(400).send('No file attached to the form');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
    // Nodemailer setup
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'ttsthapar@gmail.com', // Replace with your email
          pass: 'dsfi hrqm pbdv vaag', // Replace with your email password
        },
      });
  function sendEmail(formData,cv) {
    const mailOptions = {
      from: 'ttsthapar@gmail.com',
      to: 'ttsthapar@gmail.com', // Change to the owner's email
      subject: 'New Form Submission',
      text:`Form Data:\n
      Name: ${formData.firstName} ${formData.lastName}\n
      Roll No: ${formData.rollNo}\n
      Father's Name: ${formData.fatherName}\n
      Address: ${formData.address}\n
      Gender: ${formData.gender}\n
      DOB: ${formData.dob}\n
      Pincode: ${formData.pincode}\n
      Course: ${formData.course}\n
      Email: ${formData.email}\n `,
      attachments: [
        {
          filename: 'CV', // You can change the filename if needed
          content: cv.buffer, // The buffer containing the file data
        },
      ],

      
    //   text: 'This is a test email.',

    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }


app.get('/society',async(req,res)=>{
    const events=await event.find({});
    var currentUser;
    if(req.isAuthenticated()){
        currentUser = await User.findById(req.user._id); 
    }
    res.render('home', { currentUser,events});
})

app.get('/register',isLoggedIn, isAdmin, (req,res)=>{
    res.render('register')
})

app.post('/society/login',passport.authenticate('local', { failureFlash: true, failureRedirect: '/society/login' }), async(req,res)=>{
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/society';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

app.get('/society/login',(req,res)=>{
    var isTrue=true;
    res.render('login_page',{isTrue})
})

app.get('/society/logout', (req, res) => {
    
    req.logout(function(err) {
        if (err) { return next(err); }
        req.session.destroy();
        res.redirect('/society');
    });
})

// app.post('/society/login',async(req,res)=>{
//     const { username, password } = req.body;

//   try {
//     const user = await login.findOne({ username, password });
//     if (!user) {
//         var isTrue=false;
//         res.render('login_page',{isTrue})
//     //   return res.status(401).json({ error: 'Authentication failed' });
//     }
//         res.render('home',user)
//   } catch (error) {
//     var isTrue=false;
//     res.render('login_page', {isTrue});
//   }
// });

app.post('/register', jsonParser, isLoggedIn, isAdmin, async(req,res) => {
    const { email, username, password, role } = req.body;
    const user = new User({ email, username, role });
    const registeredUser = await User.register(user, password);
    res.redirect('/society');
})

app.get('/society/gallery', async (req,res)=>{
    var currentUser;
    if(req.isAuthenticated()){
        currentUser = await User.findById(req.user._id); 
    }
    const gallerys=await Gallery.find({});
    res.render('gallery/gallery',{gallerys,currentUser})
})

app.get('/society/gallery/new',isLoggedIn,(req,res)=>{
    res.render('gallery/new');
})

// app.post('/society/gallery',upload.single('gallery[image]'),async(req,res)=>{
//     const gal = new Gallery(req.body.gallery);
//     gal.image=req.file.buffer
//     await gal.save();
//     res.redirect('/society/gallery');
// })

const { body, validationResult } = require('express-validator');

app.post('/society/gallery',isLoggedIn, upload.single('gallery[image]'), [
    body('gallery[description]').trim().not().isEmpty().withMessage('Description is required.'),
    body('gallery[image]').custom((value, { req }) => {
        if (!req.file) {
            throw new Error('Image is required.');
        }

        // Additional image validation (e.g., file type, size) can be added here
        const allowedFileTypes = ['image/jpeg', 'image/png']; // Define allowed file types
        const maxFileSize = 5 * 1024 * 1024; // Define the maximum file size (e.g., 5 MB)

        if (!allowedFileTypes.includes(req.file.mimetype)) {
           throw new Error('Invalid file type. Allowed file types are JPEG and PNG.');
        }

        if (req.file.size > maxFileSize) {
           throw new Error('File size exceeds the maximum allowed size (5MB).');
        }

        return true; // The image is valid
    }),
], async (req, res) => {
    const errors = validationResult(req).array(); // Always have an array

    if (errors.length > 0) {
        // Render the 'gallery/new' page with errors
        const gallerys = await Gallery.find(); // Fetch existing gallery data
        res.render('gallery/new', { gallerys, errors });
    } else {
        // Proceed with saving the gallery if validation passes
        const gal = new Gallery(req.body.gallery);
        gal.image = req.file.buffer;
        await gal.save();
        res.redirect('/society/gallery');
    }
});


// const { body, validationResult } = require('express-validator');

// // ...

// app.post('/society/gallery', upload.single('gallery[image]'), [
//     body('gallery[description]').trim().not().isEmpty().withMessage('Description is required.'),
//     body('gallery[image]').custom((value, { req }) => {
//         if (!req.file) {
//            res.render('home'); // throw new Error('Image is required.');
//         }
//         // You can add additional image validation here, e.g., file type, size, etc.
//         return true;
//     }),
// ], async (req, res) => {
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//         // Validation failed, send errors back to the client
//         return res.status(400).json({ errors: errors.array() });
//     }

//     // Proceed with saving the gallery if validation passes
//     const gal = new Gallery(req.body.gallery);
//     gal.image = req.file.buffer;
//     await gal.save();
//     res.redirect('/society/gallery');
// });


app.delete('/society/gallery/:id',isLoggedIn,isHeadorAdmin, async(req,res)=>{
    const {id}= req.params
    await Gallery.findByIdAndDelete(id,{...req.body.Gallery})
    res.redirect(`/society/gallery`)
})

// app.get('/society/events', async (req,res)=>{
//     var currentUser;
//     if(req.isAuthenticated()){
//         currentUser = await User.findById(req.user._id); 
//     }
//     const events=await event.find({});
//     res.render('event/event',{events, currentUser});
// })

app.get('/society/events', async (req, res) => {
    try {
        var currentUser;
        if(req.isAuthenticated()){
            currentUser = await User.findById(req.user._id); 
        }
        let events;
        var currData = new Date();
        switch (req.query.type) {
            case 'ongoing':
                events = await event.find({ start_date: { $lte: new Date() }, end_date: { $gte: new Date() } });
                break;
            case 'past':
                events = await event.find({ end_date: { $lt: new Date() } });
                break;
            case 'future':
                events = await event.find({ start_date: { $gt: new Date() } });
                break;
            default:
                events = await event.find();
        }
        res.render('event/event',{events, currentUser});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/society/events/new',isLoggedIn,(req,res)=>{
    res.render('event/new');
})

app.post('/society/events',isLoggedIn,upload.single('event[img]'),async(req,res)=>{
    const even = new event(req.body.event);
    even.img=req.file.buffer
    await even.save();
    res.redirect('/society/events');
})

app.delete('/society/events/:id',isLoggedIn,isHeadorAdmin, async(req,res)=>{
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
    var currentUser;
    if(req.isAuthenticated()){
        currentUser = await User.findById(req.user._id); 
    }
    const members=await member.find({});
    res.render('member/member',{members,currentUser});
})

app.get('/society/members/new',isLoggedIn,isAdmin,(req,res)=>{
    res.render('member/new');
})

app.post('/society/members',isLoggedIn,isAdmin,upload.single('member[img]'),async(req,res)=>{
    const mem = new member(req.body.member);
    mem.img=req.file.buffer
    await mem.save();
    res.redirect('/society/members');
})

app.delete('/society/members/:id',isLoggedIn,isAdmin, async(req,res)=>{
    const {id}= req.params
    await member.findByIdAndDelete(id,{...req.body.member})
    res.redirect(`/society/members`)
})

app.listen(3000,()=>{
    console.log('Servering on the port 3000')
})