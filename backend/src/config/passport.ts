import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/User';
import { config } from './index';

passport.use(new GoogleStrategy({
  clientID: config.google.clientId,
  clientSecret: config.google.clientSecret,
  callbackURL: config.google.callbackUrl,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;
    if (!email) {
      return done(new Error('Google account must have an email address'));
    }

    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = profile.id;
        if (profile.photos?.[0]?.value) user.avatar = profile.photos[0].value;
        await user.save();
      }
      return done(null, user);
    }

    user = await User.create({
      name: profile.displayName,
      email,
      googleId: profile.id,
      avatar: profile.photos?.[0]?.value || '',
    });

    return done(null, user);
  } catch (error) {
    return done(error as Error);
  }
}));

passport.serializeUser((user: any, done) => {
  done(null, user._id.toString());
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
