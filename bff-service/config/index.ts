import dotenv from 'dotenv';

dotenv.config({ path: './config/config.env' });

export const NODE_ENV = process.env.NODE_ENV;
