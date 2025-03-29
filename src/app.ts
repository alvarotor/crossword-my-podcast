import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import crosswordRoutes from './routes/crosswordRoutes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Register routes
app.use(crosswordRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;
