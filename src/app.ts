import 'reflect-metadata';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { createConnection, getConnection } from 'typeorm';
import dbConnection from './db/connection';
import Routes from './common/interfaces/routes.interface';
import errorMiddleware from './api/middlewares/error.middleware';
import { logger, stream } from './common/utils/logger';
import Container from 'typedi';
import EmailService from './services/mail.service';
import rateLimit from 'express-rate-limit';

class App {
  public app: express.Application;
  public port: string | number;
  public env: string;
  public routes: Routes[];
  constructor(routes: Routes[]) {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.env = process.env.NODE_ENV || 'development';
    this.routes = routes;
  }
  public async initializeApp() {
    await this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(this.routes);
    this.initializeSwagger();
    this.initiaizeServices();
    this.initializeErrorHandling();
  }
  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`🚀 App listening on the port ${this.port}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private async connectToDatabase() {
    try {
      const connection = await createConnection(dbConnection);
      await connection.driver.afterConnect();
      logger.info('🟢 The database is connected.');
    } catch (err) {
      logger.error(`🔴 Unable to connect to the database: ${err}.`);
    }
  }

  private initializeMiddlewares() {
    if (this.env === 'production') {
      this.app.use(morgan('combined', { stream }));
      this.app.set('trust proxy', 1);
      this.app.use(cors({ origin: 'https://www.dpentagon.com', credentials: true }));
    } else if (this.env === 'development') {
      this.app.use(morgan('dev', { stream }));
      this.app.use(cors({ origin: true, credentials: true }));
    }

    this.app.use(hpp());
    this.app.use(helmet());
    // this.app.use(
    //   rateLimit({
    //     windowMs: 5 * 60 * 1000, // 15 minutes
    //     max: 200, // limit each IP to 100 requests per windowMs
    //   }),
    // );
    this.app.use(compression());
    this.app.use(express.json({ limit: '5mb' }));
    this.app.use(express.urlencoded({ limit: '5mb', extended: true }));
    this.app.use(cookieParser(process.env.JWT_SECRET));
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/api/v1/', route.router);
    });
  }

  public initiaizeServices() {
    Container.get(EmailService);
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        openapi: '3.0.0',
        info: {
          title: 'Dpentagon',
          version: '1.0.0',
          description: 'API Documentation',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
