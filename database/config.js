import mysql from "mysql2/promise"; // Using promise-based version of mysql2
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Exporting a function to obtain a database connection from the pool
export const getConnection = async () => {
    try {
        return await pool.getConnection();

    } catch (error) {
        console.error("Error obtaining database connection:", error);
        throw error;
    }
};

// Testing the database connection
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log("Connected to MySQL database with ID " + connection.threadId);
        connection.release(); // Release the connection back to the pool

    } catch (error) {
        console.error("Error connecting to database:", error);
        process.exit(1);
    }
})();