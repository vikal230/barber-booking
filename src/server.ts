import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";
import { initSocket } from "./config/socket.js";
import errorHandler from "./middleware/errorHandler.js";
import adminRoutes from "./routes/admin.routes.js";
// import "./workers/notification.worker.js";
import authRoutes from "./routes/auth.routes.js";
import salonRoutes from "./routes/salon.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import barberRoutes from "./routes/barber.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import barberDashboardRoutes from "./routes/barberDashboard.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import { startCronJobs } from "./services/cron.service.js";
import { globalLimiter, authLimiter } from "./middleware/rateLimiter.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/salon", salonRoutes);
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/barbers", barberRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/customer", customerRoutes);
app.use("/api/v1/barber", barberDashboardRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/subscription", subscriptionRoutes);
app.use(globalLimiter);
app.use("/api/v1/auth/login", authLimiter);
app.use("/api/v1/auth/register", authLimiter);

app.get("/health", (_, res) => {
  res.json({ success: true, message: "Server is running" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// const start = async () => {
//   await connectDB();
//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// };

const start = async () => {
  await connectDB();
  startCronJobs();
  const httpServer = initSocket(app);
  httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start();

export default app;