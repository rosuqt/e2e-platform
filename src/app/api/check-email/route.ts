    import { NextApiRequest, NextApiResponse } from "next";
    import client from "../db.js";  

    export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { email } = req.body;

        try {

        const result = await client.query('SELECT * FROM pending_employers WHERE email = $1', [email]);
        const exists = result.rows.length > 0;
        res.status(200).json({ exists });
        } catch (err) {
        console.error("Database query failed", err);
        res.status(500).json({ message: "Failed to check email" });
        }
    } else {
        res.status(405).json({ message: "Method Not Allowed" }); // Handle 405 error
    }
    }
