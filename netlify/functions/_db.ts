import mongoose from 'mongoose';

let cached: mongoose.Connection | null = null;

export async function connectDB(): Promise<mongoose.Connection> {
  if (cached && cached.readyState === 1) return cached;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI environment variable is not set');

  const conn = await mongoose.connect(uri, {
    bufferCommands: false,
    dbName: 'portfolio',
    serverSelectionTimeoutMS: 10000,
  });
  cached = conn.connection;
  return cached;
}
