import express from 'express';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import leadRoutes from './routes/leads';
import settingRoutes from './routes/settings';
import chatRoutes from './routes/chat';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(compression());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
    res.send('Omkar International School Backend is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
