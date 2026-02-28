import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/healnet';

const testConnection = async () => {
    try {
        console.log(`Attempting to connect to: ${MONGO_URI}`);
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('SUCCESS: MongoDB is connected!');
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('FAILURE: Could not connect to MongoDB.');
        console.error(error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
};

testConnection();
