import { Client } from "pg";

const client = new Client({
  user: "postgres", // Replace with your PostgreSQL username
  host: "localhost", // Replace with your host (usually 'localhost')
  database: "e2e_auth", // Replace with your database name
  password: "Paramore867", // Replace with your database password
  port: 5432, // Default PostgreSQL port
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to the database");
  } catch (err) {
    console.error("Connection error", err.stack);
  }
}

// Call the connect function to establish a database connection
connectToDatabase();

export default client;
