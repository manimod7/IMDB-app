const express= require('express');
const app=express();
const mongoose = require("mongoose");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require("connect-flash");
const indexRoutes= require("./routes/index");
const dotenv =require('dotenv');
dotenv.config();
//Using Mongoose
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
};

// mongoose.connect("mongodb+srv://${process.env.un}:${process.env.pw}@cluster0.kzyx8.mongodb.net/imdb?retryWrites=true&w=majority",options);
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true);
const whole=process.env.whole;
mongoose.connect(whole,options);

//Middleware
app.use(flash());
app.use(cookieParser());
app.set("view engine", "ejs");
app.use('/public', express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'Secret'
}));
//To have a global variable across
app.use(function(req, res, next) {
    if (req.session.isLoggedIn) {
        res.locals.currentUser = req.session.user;
    } else {
        res.locals.currentUser = null;
    }
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
//Routes
app.use("/", indexRoutes);
app.get("*", (req, res)=>{
    res.send("Some Error");
});
app.listen(5000, function(){
    console.log("Server Has Started");
});