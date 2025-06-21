import 'reflect-metadata';
import express, { Express } from 'express';
import * as dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import welcomeRoutes from './routes/welcome.route';
import usersRoutes from './routes/users.routes';
import { initializeDatabase } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import postRoutes from './routes/post.route';
import cors from 'cors';


dotenv.config();

const app: Express = express();

app.use(cors());

const PORT: number = parseInt(process.env.PORT || '5000');

//Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/', welcomeRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/post', postRoutes)


// Error handling middleware
app.use(errorHandler);

// Start the server
const startServer = async () => {
    try {
      // Initialize db connection
      await initializeDatabase();
      
      // Start Express server
      app.listen(PORT, () => {
        console.log(`🚀 Server running on http://127.0.0.1:${PORT}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  };
  
  // Run the server
  startServer();