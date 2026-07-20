import { Router } from 'express';
import passport from '../config/passport';
import { register, login, logout, refreshToken, getProfile, updateProfile } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { config } from '../config';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticate, logout);
router.post('/refresh-token', refreshToken);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: `${config.frontendUrl}/login` }), (req, res) => {
  const user = req.user as any;
  const accessToken = jwt.sign({ userId: user._id.toString() }, config.jwt.secret, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ userId: user._id.toString() }, config.jwt.refreshSecret, { expiresIn: '7d' });
  res.redirect(`${config.frontendUrl}/auth/callback#accessToken=${accessToken}&refreshToken=${refreshToken}`);
});

export default router;
