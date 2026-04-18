import mongoose from "mongoose";

/**
 * Singleton database connection manager — ensures a single Mongoose connection lifecycle.
 */
export class DatabaseConnectionManager {
  private static instance: DatabaseConnectionManager;

  private constructor() {}

  public static getInstance(): DatabaseConnectionManager {
    if (!DatabaseConnectionManager.instance) {
      DatabaseConnectionManager.instance = new DatabaseConnectionManager();
    }
    return DatabaseConnectionManager.instance;
  }

  public async connect(uri: string): Promise<void> {
    await mongoose.connect(uri);
  }

  public getConnection(): typeof mongoose {
    return mongoose;
  }
}
