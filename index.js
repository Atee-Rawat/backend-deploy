const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const connections = require("./db");
connections();

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const rupinClientRoutes = require("./routes/rupin_b/clientRoutes");
const windowRoutes = require("./routes/rupin_b/windowRoutes");
const curtainRoutes = require("./routes/rupin_b/curtainRoutes");
const blindRoutes = require("./routes/rupin_b/blindRoutes");
const roomRoutes = require("./routes/rupin_b/roomRoutes");

app.use(morgan("dev"));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser());

app.use("/user", authRoutes);
app.use("/product", productRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/rupin", rupinClientRoutes);
app.use("/api/rupin/windows", windowRoutes);
app.use("/api/rupin", curtainRoutes);
app.use("/api/rupin", blindRoutes);
app.use("/api/rupin/rooms", roomRoutes);

const errorHandler = require("./middleware/error");
app.use(errorHandler);

const port = process.env.PORT || 9000;
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${port}`);
});
