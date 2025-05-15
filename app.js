const express = require("express");

require("dotenv").config();

const sanitize = require("sanitize");

const cors = require("cors");

// const allowedOrigins = [
//   "https://bahtaexpress.com",
//   "https://dashboard.bahtaexpress.com",
// ];
const allowedOrigins = [
  process.env.DASHBOARD_FRONTEND_URL,
  process.env.LANDING_FRONTEND_URL,
];
// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

const app = express();

// Apply CORS middleware
app.use(cors(corsOptions));

app.use(express.json());
app.use(sanitize.middleware);

app.use("/public", express.static("public"));

const router = require("./routes");
app.use(router);

// Start the server
const port = process.env.PORT;
const SERVER = app.listen(port, () => {
  console.log(
    `The server is living its best life at port ${port} come say hi!!`
  );
});

module.exports = app;
