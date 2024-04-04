import express from "express";
import cors from "cors";

import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

// Middleware
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// Rotas
app.use("/cart", cartRouter);
app.use("/order", orderRouter);
app.use("/product", productRouter);
app.use("/user", userRouter);

export default app;