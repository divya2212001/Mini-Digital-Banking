import "dotenv/config";
import app from "./app";
import { DatabaseConnectionManager } from "./config/database";

const PORT = Number(process.env.PORT) || 5001;

async function bootstrap(): Promise<void> {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI is not set");
    process.exit(1);
  }
  await DatabaseConnectionManager.getInstance().connect(uri);
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
