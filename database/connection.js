import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const connection = mysql.createConnection({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

connection.connect((error) => {
    if (error) {
        console.error("Error connecting to database: " + error.stack);
        process.exit(1);
    }

    console.log("Connected to MySQL database with ID " + connection.threadId);
});

export default connection;