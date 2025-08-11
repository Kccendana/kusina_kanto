const express = require('express');
const app = express();
const mongodb = require('./data/database')
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000
const passport = require("passport");
const session = require("express-session");
const GithubStrategy = require("passport-github2").Strategy;
const cors = require("cors");



app.use(bodyParser.json()).use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
})).use(passport.initialize())
  .use(passport.session());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next();
}).use(cors({ methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], origin: '*' }));


passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL || 'https://team01-finalproject.onrender.com/github/callback', //changed from "https://cse341-1-3v1z.onrender.com/github/callback"
}, (accessToken, refreshToken, profile, done) => {
    // Here you would typically save the user to your database
    return done(null, profile);
}));


app.use('/', require('./routes'));

passport.serializeUser((user, done) => {
    done(null, user);
});


passport.deserializeUser((user, done) => {
    done(null, user);
});


app.get('/', (req, res) => { res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.username}` : "Logged out")});
 


app.get('/github/callback', passport.authenticate('github', { failureRedirect: '/api-docs', session: false}), (req, res) => {
    req.session.user = req.user;
    res.redirect('/'); // Redirect to home page after successful authentication
});

mongodb.initDb((err) => {
  if (err) {
    console.log(err)
  }else {
    app.listen(port, () => {
    console.log(`Database listening and node running on port ${port}`);
});
  }
})