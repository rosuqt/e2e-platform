import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Supabase needs this
  },
});

client.connect().catch((err) => {
  console.error("Failed to connect to the database:", err);
});

export default client;
