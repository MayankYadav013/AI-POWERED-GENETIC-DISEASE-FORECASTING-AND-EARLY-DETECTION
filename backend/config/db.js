const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let memoryServer;
const PRIMARY_URI_KEYS = ['MONGO_URI', 'MONGODB_URI', 'DATABASE_URL'];

const connectWithUri = async (uri) => {
    const serverSelectionTimeoutMS = parseInt(process.env.MONGO_TIMEOUT_MS || '5000', 10);
    await mongoose.connect(uri, { serverSelectionTimeoutMS });
};

const resolveMongoUri = () => {
    for (const key of PRIMARY_URI_KEYS) {
        const value = process.env[key];
        if (value && value.trim()) {
            return { uri: value.trim(), key };
        }
    }
    return { uri: null, key: null };
};

const connectDB = async () => {
    const { ENABLE_MEMORY_DB = 'true' } = process.env;
    const { uri: primaryUri, key: primaryKey } = resolveMongoUri();

    if (!primaryUri) {
        throw new Error(
            `Mongo connection string is not defined. Please set one of ${PRIMARY_URI_KEYS.join(', ')} in your environment variables.`
        );
    }

    try {
        await connectWithUri(primaryUri);
        console.log(`MongoDB Connected via ${primaryKey || 'MONGO_URI'}`);
        return;
    } catch (err) {
        console.error(`Primary MongoDB connection via ${primaryKey || 'MONGO_URI'} failed:`, err.message);
        if (ENABLE_MEMORY_DB.toLowerCase() !== 'true') {
            process.exit(1);
        }
    }

    try {
        memoryServer = await MongoMemoryServer.create();
        const memoryUri = memoryServer.getUri();
        await connectWithUri(memoryUri);
        console.warn('⚠️  Running with in-memory MongoDB instance (dev only).');
    } catch (memoryErr) {
        console.error('Failed to start in-memory MongoDB:', memoryErr);
        process.exit(1);
    }
};

const gracefulShutdown = async () => {
    await mongoose.connection.close();
    if (memoryServer) {
        await memoryServer.stop();
    }
    process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

module.exports = connectDB;