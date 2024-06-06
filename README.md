# Passport Local vs Passport Local Mongoose

## 1. Passport Local

### Introduction:

Passport.js provides various authentication strategies, each tailored to a specific authentication method (e.g., local authentication, OAuth, JWT, etc.). LocalStrategy is one such strategy specifically designed for handling traditional username-password authentication. Passport Local is a middleware for Node.js that provides user authentication via a username and password. It allows you to define custom authentication logic using a LocalStrategy.

### Usage:

```javascript
// module imports
const passport = require('passport');
const LocalStrategy = require('passport-local');

// file imports
const UserModel = require('../models/user'); // Assuming this is your user model

passport.use(
  new LocalStrategy(function (username, password, done) {
    UserModel.findOne({ username: username }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.matchPasswords(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id); // Store only the user's ID in the session
});

passport.deserializeUser(function (id, done) {
  UserModel.findById(id, function (err, user) {
    done(err, user); // Retrieve the user object based on the stored ID
  });
});
```

## 2. Passport Local Mongoose

### Introduction:

Passport Local Mongoose simplifies user authentication by integrating with Mongoose schemas. It automates the setup of Passport Local's LocalStrategy based on your Mongoose schema.

### Usage:

```javascript
// module imports
const passport = require('passport');
const LocalStrategy = require('passport-local');

// file imports
const UserModel = require('../models/user'); // Assuming this is your user model

passport.use(new LocalStrategy(UserModel.authenticate())); // passport.use(UserModel.createStrategy());

passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());
```

## Summary:

## Traditional Passport-Local Configuration

In traditional Passport-Local configuration, you manually define a local strategy using `passport.use(new LocalStrategy(...))`, where you specify how Passport should authenticate a user based on their credentials (typically username and password). This involves defining a function that checks if the provided username and password match a user in your database.

## Passport-Local Mongoose Configuration

In Passport-Local Mongoose configuration, the `createStrategy()` method is responsible for setting up the passport-local LocalStrategy with the correct options.

Here you can use either `passport.use(User.createStrategy())` or `passport.use(new LocalStrategy(UserModel.authenticate()))`.

The createStrategy() method ensures that the LocalStrategy is configured correctly based on the options defined in your Mongoose schema. This includes handling custom field names, such as using "email" instead of "username" for authentication. Passport-Local Mongoose takes care of aligning the local strategy with your schema's specifications.

### Handling Alternative Field Names

When using `passport.authenticate('local')` as a middleware in routes, you typically have to provide the username and password fields in `req.body`. However, when using `createStrategy()` with the `usernameField` option to specify an alternative field name (e.g., "email"), passport-local would still expect your frontend login form to contain an input field with the name "username" instead of "email". This can be configured for passport-local, but it involves additional work. Passport-Local Mongoose, configured to use the email field for authentication, automatically handles authentication using the provided email and password.

<strong>Passport-Local Mongoose will add a username, hash, and salt field to store the username, the hashed password, and the salt value.</strong>

### Static Methods Added by Passport-Local Mongoose

- `authenticate()`
- `serializeUser()`
- `deserializeUser()`
- `register(user, password, cb)`
- `findByUsername()`
- `createStrategy()`

### Instance Methods Added by Passport-Local Mongoose

- `setPassword(password, [cb])`
- `changePassword(oldPassword, newPassword, [cb])`
- `authenticate(password, [cb])`
