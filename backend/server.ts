// backend/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dashboardRoutes from './routes/dashboardRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});