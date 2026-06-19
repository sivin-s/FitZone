import dotenv from "dotenv";

dotenv.config();

import app from "./app.ts";
import { connectDB } from "./config/database.ts";
import { logger } from "./config/logger.ts";

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
