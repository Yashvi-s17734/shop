const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../src/models/User");
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.NODE_ENV === "production"
          ? "https://shop-u7pg.onrender.com/api/auth/google/callback"
          : "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email }],
        });

        if (!user) {
          const baseUsername = profile.displayName
            .replace(/\s+/g, "")
            .toLowerCase();

          let username = baseUsername;
          let count = 1;

          // 🔁 Ensure unique username
          while (await User.findOne({ username })) {
            username = `${baseUsername}${count}`;
            count++;
          }

          user = await User.create({
            username,
            email,
            provider: "google",
            googleId: profile.id,
            password: null,
          });
        } else if (!user.googleId) {
          // 🔗 Link existing local account to Google
          user.googleId = profile.id;
          user.provider = "google";
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

module.exports = passport;
