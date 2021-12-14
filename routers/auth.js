const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const userModel = require("../db/models/user");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.URL}/google/callback`,
    },
    function (request, accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    const currentUser = await userModel.findOne({ id });
    done(null, currentUser);
  });
