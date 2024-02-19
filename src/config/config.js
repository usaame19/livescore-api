import dotenv from 'dotenv';


dotenv.config();

export const CLOUDNARY_API_SECRET = process.env.CLOUDNARY_API_SECRET;
export const CLOUDNARY_API_KEY = process.env.CLOUDNARY_API_KEY;
export const CLOUDNARY_CLOUD_NAME = process.env.CLOUDNARY_CLOUD_NAME;
export const JWT_Secret = process.env.JWT_SECRET_KEY;
export const APP_PASSWORD = process.env.APP_PASSWORD;