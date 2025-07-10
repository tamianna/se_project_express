const express = require("express");

const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

const { PORT = 3001 } = process.env;

const routes = require("./routes/index");
const { NOT_FOUND } = require("./utils/errors");

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/", routes);

app.use("*", (req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
