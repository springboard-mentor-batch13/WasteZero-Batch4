import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("WasteZero API running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
