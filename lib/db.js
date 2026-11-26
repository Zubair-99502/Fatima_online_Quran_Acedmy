import mongoose from 'mongoose';
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error('Please define MONGODB_URI in .env.local');
let cache = global.mongoose;
if (!cache) cache = global.mongoose = { conn: null, promise: null };
export async function connectDB() {
  if (cache.conn) return cache.conn;
  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false })
      .then(connection => { cache.conn = connection; return connection; })
      .catch(error => { cache.promise = null; cache.conn = null; throw error; });
  }
  return cache.promise;
}
