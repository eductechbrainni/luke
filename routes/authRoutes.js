const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcryptjs');


router.get('/register', (req, res) => {
    res.render('register');  // Assuming you have a 'register.ejs' view file
});

// Register Route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(409).send('User already exists with the same username or email.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        await newUser.save();

        // Log in the user automatically after registration
        req.login(newUser, (err) => {
            if (err) {
                console.error('Login error after registration:', err);
                return res.status(500).send('Error logging in new user.');
            }
            return res.redirect('/'); // Redirect to the home page or a dashboard page as required
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).send('Error registering new user: ' + error.message);
    }
});




// Route to render the login form
router.get('/login', (req, res) => {
    res.render('login', { message: req.flash('error') }); // Assuming you're using connect-flash for error messaging
});

// Login Route
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/logout', (req, res) => {
    console.log('Logging out user:', req.user);
    req.logout(function(err) {
        if (err) {
            console.error('Logout error:', err);
            return next(err);
        }
        console.log('Session after logout:', req.session);
        res.redirect('/');
    });
});

module.exports = router;
