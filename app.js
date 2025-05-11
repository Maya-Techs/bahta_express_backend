const express = require("express");

require("dotenv").config();

const sanitize = require("sanitize");

const cors = require("cors");
const allowedOrigins = [
  "https://bahtaexpress.com",
  "https://dashboard.bahtaexpress.com",
];
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

const port = process.env.PORT;

const router = require("./routes");

const app = express();

app.use(cors(corsOptions));

app.use(express.json());

// serve the pub dir as static..
app.use("/public", express.static("public"));

app.use(sanitize.middleware);

app.use(router);

const SERVER = app.listen(port, () => {
  console.log(
    `The server is living its best life at port... ${port} come say hi!!`
  );
});

module.exports = app;
