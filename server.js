const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: '*' }));
app.use(express.json());
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connection established"))
  .catch((err) => console.log("MongoDB connection error: ", err));

app.get('/', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.post("/signup", async (req, res) => {
  const { userName, password, gender, skills } = req.body;
  const user = new User({ userName, gender, skills, password });
  await user.save();
  res.json(user);
});

app.post("/login", async (req, res) => {
  const { userName, password } = req.body;
  const user = await User.findOne({ userName, password });
  if (user) {
    res.json(user);
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});