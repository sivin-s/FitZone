import "reflect-metadata"; // meta-data for inversify after compile (js).
import dotenv from "dotenv";

dotenv.config();

import app from "./app.ts";
import { connectDB } from "./config/database.ts";

// DI container 
import {appContainer} from './DiContainer.ts'

// type
import {LOGGER_TYPES} from './DITypes/index.ts'
import type {ILogger} from './shared/interfaces/ILogger.ts'

// retrieve the singleton LoggerService from the DI container
const logger = appContainer.get<ILogger>(LOGGER_TYPES.ILogger)


const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => logger.info(`server started 🌐 ,${PORT}`));
  } catch (err: any) {
    logger.error(`❌ Server startup failed ,${err.message}`);
    process.exit(1);
  }
};

startServer();
