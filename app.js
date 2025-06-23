const express = require("express");

const app = express();
const mongoose = require("mongoose");

const { PORT = 3001 } = process.env;

const userRoutes = require("./routes/users");
const clothingItemRoutes = require("./routes/clothingItems");

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "68558513705d7d68477548aa",
  };
  next();
});

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

app.use("/users", userRoutes);
app.use("/items", clothingItemRoutes);

app.use("*", (req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

// app.get('/', (req, res) => {
//  res.send('Hello from Express!');
// });

app.listen(PORT, () => {
  console.log("Server is running on port ${PORT}");
});
