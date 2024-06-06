// module imports
const passport = require('passport');
const LocalStrategy = require('passport-local');

// file imports
const UserModel = require('../models/user');

passport.use(new LocalStrategy(UserModel.authenticate())); // passport.use(UserModel.createStrategy());  // Creates a configured passport-local LocalStrategy instance that can be used in passport.

passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());
