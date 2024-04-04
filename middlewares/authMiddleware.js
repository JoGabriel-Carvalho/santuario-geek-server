import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {
    // Extract the token from the request header
    const token = req.headers.authorization;

    // Check if token is provided
    if (!token) {
        return res.status(401).json({ message: "Token not provided" });
    }

    try {
        // Verify if the token is valid and decode its information
        // Pass decoded user information to protected routes
        req.user = jwt.verify(token, process.env.JWT_SECRET);

        // Call the next middleware
        next();

    } catch (error) {
        // In case of token verification error
        return res.status(401).json({ message: "Invalid token" });
    }
};

export default authMiddleware;