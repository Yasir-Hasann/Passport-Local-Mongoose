// module imports
const cors = require('cors');
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');

// file imports
require('./config/passport');
const connectDB = require('./config/connect-db');
const apiRouter = require('./routes');
const errorHandler = require('./middlewares/error-handler');

// variable initializations
const app = express();
const port = process.env.PORT || 5001;

// connect to MongoDB Database
connectDB();

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(session({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session()); // app.use(passport.authenticate('session'));
app.use(morgan('dev'));

// mount routes
app.use('/api/v1', apiRouter);
app.use('/ping', (req, res) => {
  return res.status(200).json({ success: true, message: 'Bro: I am live and working' });
});
app.all('/*', (req, res) => {
  res.json({ success: false, message: 'Invalid URL' });
});
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

console.log(process.env.NODE_ENV.toUpperCase());
