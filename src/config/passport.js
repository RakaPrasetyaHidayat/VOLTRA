const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./db');

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn('GoogleStrategy skipped: set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable Google OAuth');
} else {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.APP_URL}/api/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        const { id, displayName, emails, photos } = profile;
        const email = emails[0].value;
        const avatarUrl = photos[0].value;

        try {
          
          let userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
          let user;

          if (userResult.rows.length === 0) {
            
            const newUser = await db.query(
              'INSERT INTO users (full_name, email, avatar_url, is_verified) VALUES ($1, $2, $3, TRUE) RETURNING *',
              [displayName, email, avatarUrl]
            );
            user = newUser.rows[0];
          } else {
            user = userResult.rows[0];
          }

          
          const oauthResult = await db.query(
            'SELECT * FROM oauth_accounts WHERE provider = $1 AND provider_user_id = $2',
            ['google', id]
          );

          if (oauthResult.rows.length === 0) {
            await db.query(
              'INSERT INTO oauth_accounts (user_id, provider, provider_user_id) VALUES ($1, $2, $3)',
              [user.id, 'google', id]
            );
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

// Kita gak pake sessions, tapi passport tetep minta ini pas pake passport.initialize()
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => done(null, { id }));

module.exports = passport;
