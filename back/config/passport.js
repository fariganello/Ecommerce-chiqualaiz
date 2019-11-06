var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
//var { User } = require('../../back/models'); chequear ruta models

passport.use(
 new LocalStrategy(
   function(username, password, done) {
     User.findOne({
       where: {
         username: username
       }
     }).then(function(user) {
       if (!user) {
         return done(null, false, {
           message: "Incorrect email."
         });
       } else if (!user.validatePassword(password)) {
         return done(null, false, {
           message: "Incorrect password."
         });
       }
       return done(null, user);
     });
   }
 )
);

passport.serializeUser(function(user, done) {
  done(null, user);
 });
 passport.deserializeUser(function(obj, done) {
  done(null, obj);
 });

module.exports = passport;