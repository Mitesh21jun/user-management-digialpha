import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user.js';
import connectDB from './config/db.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', userRoutes);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
