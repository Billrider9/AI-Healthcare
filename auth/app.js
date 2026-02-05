const express = require("express");
// const flowLimit = require('express-flowlimit');

const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const orderRouter = require("./routes/orderRoute");
const paymentRouter = require("./routes/paymentRoute");
const productRouter = require("./routes/productRoute");
const userRouter = require("./routes/userRoute");

const app = express();

// const limiter = flowLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // max requests per IP
//   message: "Too many requests, please try again later."
// });

app.use(express.json());
app.use(cookieParser());
// app.use(limiter);
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/order', orderRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/product', productRouter);
app.use('/api/user', userRouter);

// deployment
__dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Server is Running! 🚀");
  });
}

module.exports = app;
