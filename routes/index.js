const express = require("express");

const router = express.Router();

const installRouter = require("./install.routes");

const loginRouter = require("./login.routes");

const passwordResetRouter = require("./password_reset.routes");

const userRouter = require("./user.routes");

const categoryRouter = require("./categories.routes");

const tagRouter = require("./tag.routes");

const clientRouter = require("./client.routes");

const blogRouter = require("./blog.routes");

const dashboardRouter = require("./dashboard.routes");

const serviceRouter = require("./service.route");

const quoteRouter = require("./quote.route");

router.use(installRouter);

router.use(loginRouter);

router.use(passwordResetRouter);

router.use(userRouter);

router.use(categoryRouter);

router.use(tagRouter);

router.use(clientRouter);

router.use(blogRouter);

router.use(dashboardRouter);

router.use(serviceRouter);

router.use(quoteRouter);

module.exports = router;
