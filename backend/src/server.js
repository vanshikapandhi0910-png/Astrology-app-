import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import astrologyRoutes from './routes/astrologyRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Ephemeral / Privacy verification header
app.use((req, res, next) => {
  res.setHeader('X-Privacy-Mode', 'Zero-Persistent-Storage');
  next();
});

// Routes
app.use('/api/astrology', astrologyRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Vedic Astrology & Vastu Intelligence Engine',
    timestamp: new Date().toISOString(),
    privacy: '100% Ephemeral - No User Storage'
  });
});

app.listen(PORT, () => {
  console.log(`✨ Astrology Engine Backend running on port ${PORT}`);
  console.log(`🌌 Privacy Mode: Active (Zero data persistence)`);
});
