const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();


// Middleware
app.use(express.json());   
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

// Routes
const authRouter = require('./routes/auth.routes');
const postRouter = require('./routes/post.routes');
const userRouter = require('./routes/user.routes');

app.use('/api/posts', postRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

module.exports = app;       