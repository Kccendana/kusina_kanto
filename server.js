const express = require('express');
const app = express();
const mongodb = require('./data/database')
const { ObjectId } = require('mongodb');
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
    callbackURL: process.env.GITHUB_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const db = mongodb.getDatabase();
        // Try to find the user in MongoDB by username or email
        let user = await db.collection('users').findOne({ email: profile.emails[0].value });
        console.log(user);
        if (!user) {
            // If not found, create new user with default role
            user = {
                userName: profile.username,
                email: profile.emails[0].value,
                role: 'client' // default role
            };
            const result = await db.collection('users').insertOne(user);
            user._id = result.insertedId;
        }

        // Pass the user object (with role) to Passport
        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));
// passport.use(new GithubStrategy({
//     clientID: process.env.GITHUB_CLIENT_ID,
//     clientSecret: process.env.GITHUB_CLIENT_SECRET,
//     callbackURL: process.env.GITHUB_CALLBACK_URL, //changed from "https://cse341-1-3v1z.onrender.com/github/callback"
// }, (accessToken, refreshToken, profile, done) => {
//     // Here you would typically save the user to your database
//     return done(null, profile);
// }));


app.use('/', require('./routes'));

passport.serializeUser((user, done) => {
    done(null, user._id); // store only the _id in the session
});

passport.deserializeUser(async (id, done) => {
    try {
        const db = mongodb.getDatabase();
        const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
        done(null, user); // user will have role, username, etc.
    } catch (err) {
        done(err, null);
    }
});

// passport.serializeUser((user, done) => {
//     done(null, user);
// });

// passport.deserializeUser(async (id, done) => {
//     try {
//         const db = getDatabase();
//         const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
//         done(null, user);
//     } catch (err) {
//         done(err, null);
//     }
// });
// passport.deserializeUser((user, done) => {
//     done(null, user);
// });
 


app.get('/github/callback', passport.authenticate('github', { failureRedirect: '/api-docs'}), (req, res) => {
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