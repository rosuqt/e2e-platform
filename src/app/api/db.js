import { Client } from "pg";

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "e2e_auth",
  password: "Paramore867",
  port: 5432,
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to the database");
  } catch (err) {
    console.error("Connection error", err.stack);
  }
}

connectToDatabase();

export default client;
