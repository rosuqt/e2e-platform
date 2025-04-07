import { Client } from "pg";

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "e2e_auth",
  password: "Paramore867",
  port: 5432,
});

client.connect();

export default client;
