import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from './config';
import { connectDatabase } from './config/database';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import passport from './config/passport';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from './models/User';
import authRoutes from './routes/auth.routes';
import propertyRoutes from './routes/property.routes';
import aiRoutes from './routes/ai.routes';
import productRoutes from './routes/product.routes';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: config.frontendUrl,
    methods: ['GET', 'POST'],
  },
});

app.use(helmet());
app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

let echoCounter = 0;
app.all('/api/echo', (req, res) => {
  echoCounter++;
  res.json({ success: true, echo: echoCounter });
});
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use('/api', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/products', productRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is running', timestamp: new Date().toISOString() });
});

app.get('/api/debug', async (req, res) => {
  try {
    const state = mongoose.connection.readyState;
    const dbInfo = { connected: state === 1, state: ['disconnected', 'connected', 'connecting', 'disconnecting'][state] || 'unknown' };
    let userCount = 0;
    let userInfo = 'none';
    try {
      userCount = await User.countDocuments({});
      const demo = await User.findOne({ email: 'demo@investor.com' }).select('+password');
      userInfo = demo ? `found (id: ${demo._id}, hasPw: ${!!demo.password})` : 'not found';
    } catch (e: unknown) { userInfo = `error: ${(e as Error).message}`; }
    res.json({ success: true, db: dbInfo, userCount, userInfo, env: { node: process.version, nodeEnv: process.env.NODE_ENV } });
  } catch (e: unknown) { res.json({ success: false, error: (e as Error).message }); }
});

app.get('/api/ping', (req, res) => {
  res.json({ success: true, message: 'pong' });
});

app.get('/api/testlogin', async (req, res) => {
  try {
    const user = await User.findOne({ email: 'demo@investor.com' }).select('+password');
    res.json({ success: true, found: !!user, hasPassword: !!(user && user.password) });
  } catch (e: unknown) {
    res.json({ success: false, error: (e as Error).message, stack: (e as Error).stack });
  }
});

app.use(notFoundHandler);
app.use(errorHandler);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join', (userId: string) => {
    socket.join(`user:${userId}`);
  });

  socket.on('notification', (data) => {
    io.to(`user:${data.userId}`).emit('notification', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const startServer = async () => {
  await connectDatabase();

  httpServer.listen(config.port, () => {
    console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
  });
};

startServer().catch(console.error);

export { app, httpServer, io };
