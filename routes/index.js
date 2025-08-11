const express = require("express");
const router = new express.Router();
const userRoutes = require('./user');
const menuRoutes = require('./menu');
const passport = require('passport');

const orderRoutes = require('./order');
const paymentRoutes = require('./payment');


// router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get('/', (req, res) => {
    res.send(req.session.user !== undefined ? `Hello ${req.session.user.displayName}` : 'Logged Out');
});


router.use('/users', userRoutes);
router.use('/menu', menuRoutes);
router.use('/orders', orderRoutes);
router.use('/payment', paymentRoutes);
router.use('/api-docs', require('./swagger'));

router.get('/login', passport.authenticate('github'), (req, res) => {});

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});


module.exports = router;