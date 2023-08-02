const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());
const authenticationRoutes = require("./routes/authenticationRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const packageRoutes = require("./routes/packageRoutes");
const { auth, isAdmin } = require("./middlewares/authMiddleware");

// const createUserAndBusiness = require('./models/createData');

// const userData = {
//     firstName: 'John',
//     lastName: 'Doe',
//   };

//   const businessData = {
//       businessName: 'Business A',
//       businessType: 'Category A',
//   };

//   createUserAndBusiness(userData, businessData);

app.use("/api", authenticationRoutes);

app.use("/api/admin", auth, isAdmin, adminRoutes);
app.use("/api/user", auth, userRoutes);
app.use("/api/", packageRoutes);

app.get("/", async (req, res) => {
  res.send("<h1>Welcome to Alexis website</h1>");
});

module.exports = app;
