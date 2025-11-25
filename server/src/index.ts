import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import { createLogger } from './lib/logger';
import mongoose from 'mongoose';
import { connectToDatabase, connectMongooseToDatabase } from './db';
import { authRouter } from './routes/auth.routes';
import { healthRouter } from './routes/health.routes';
// import orderRoutes from './routes/order.routes'; // TODO: Réactiver après migration Mongoose
import { errorHandler, notFoundHandler } from './middleware/error-handler';

const logger = createLogger('Server');

const app = express();

// ==================== MIDDLEWARE ====================
app.use(
  cors({
    origin: config.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== ROUTES ====================
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
// app.use('/api', orderRoutes); // TODO: Réactiver après migration Mongoose

// ==================== ERROR HANDLING ====================
app.use(notFoundHandler);
app.use(errorHandler);

// ==================== SERVER START ====================
async function startServer() {
  try {
    // Connecter à MongoDB (pour Better Auth)
    await connectToDatabase();
    
    // Connecter Mongoose (pour les modèles)
    await connectMongooseToDatabase();
    
    // Démarrer le serveur Express
    const server = app.listen(config.PORT, () => {
      logger.info(`Server started on http://localhost:${config.PORT}`);
      logger.info(`Environment: ${config.NODE_ENV}`);
    });

    // ==================== GRACEFUL SHUTDOWN ====================
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM reçu, arrêt du serveur...');
      server.close(async () => {
        await mongoose.connection.close();
        logger.info('Serveur arrêté');
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      logger.info('SIGINT reçu, arrêt du serveur...');
      server.close(async () => {
        await mongoose.connection.close();
        logger.info('Serveur arrêté');
        process.exit(0);
      });
    });
    
  } catch (error) {
    logger.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
}

// Démarrer le serveur
startServer();
