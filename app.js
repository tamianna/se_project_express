const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const { errors } = require("celebrate");

const { PORT = 3001 } = process.env;
const routes = require("./routes/index");
const NotFoundError = require("./errors/NotFoundError");
const errorHandler = require("./middlewares/error-handler");

const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

// Security + Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use("/", routes);

// Catch-all for unknown routes
app.use("*", (req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

// celebrate error handler
app.use(errors());

// Centralized error handler (must be last middleware)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
