import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const adminClient = axios.create({
  baseURL: process.env.ADMIN_SERVICE_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default adminClient;
