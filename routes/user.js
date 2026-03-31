const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/signup', (req, res) => {
    return res.render('signup');
});

router.get('/signin', async (req, res) => {
    return res.render('signin');
});

router.post('/signin', async (req, res) => {
   const { email, password } = req.body;
   const user = User.matchPassword(email, password);

   console.log('user', user);
   return res.redirect('/')
   
})
router.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        await User.create({ fullName, email, password })
        return res.redirect('/')
    } catch (err) {
        console.error('Error creating user:', err);
        // If validation error, pass errors to the template to show feedback
        const errors = err && err.errors ? err.errors : null;
        return res.status(400).render('signup', { errors });
    }
})



module.exports = router;