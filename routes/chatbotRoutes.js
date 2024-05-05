const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust the path as per your project structure

// Example route for handling GET requests to /chatbot
const questions = [
    {
        text: "Hi there! 👋 I'm your friendly math buddy, here to make learning numbers as easy as 1-2-3! 🧮 Let’s dive into the exciting world of mathematics. Before we get started, I'd love to get to know you better. What's your name?",
        type: "bot"
    },
    {
        text: "Please choose an image to continue.",
        type: "bot"
    },
    {
        text: "Could you tell me which grade you're in?",
        type: "bot",
        options: [1, 2, 3, 4] // Options for grades 1 to 4
    },
    {
        text: "That's the perfect time to explore some really cool math concepts. Now, what topic are you interested in tackling today?",
        type: "bot",
        options: ["Addition", "Subtraction", "Multiplication"] // Options for math topics
    },
    {
        text: "Great choice! Let's dive into ${topic} today.",
        type: "bot",
        isDynamic: true, // Indicate that this message is dynamic
        button: "Play video" // Option for button
    }
];

router.get('/', async (req, res) => {
    console.log("Authenticated status in /chatbot route:", req.isAuthenticated()); // Debug: Check authentication status
    try {
        if (req.isAuthenticated()) {
            // For authenticated users
            const user = await User.findById(req.user._id);
            if (!user) {
                throw new Error('User not found in database.');
            }
            user.visitCount += 1;
            await user.save();
            // Render the chatbot page for authenticated users
            res.render('chatbot', {
                user: user,
                questions: JSON.stringify(questions),
                visitCount: user.visitCount,
                isAuthenticated: true,
            });
        } else {
            // For unauthenticated users, prominently display a message about the benefits of logging in
            res.render('chatbot', {
                questions: JSON.stringify(questions),
                isAuthenticated: false,
                message: "Note: Your progress and interactions won't be tracked or saved unless you sign up or log in. Create an account for a personalized experience!"
            });
        }
    } catch (error) {
        console.error("Error in /chatbot route:", error);
        res.status(500).send("An error occurred");
    }
});

module.exports = router;
