const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./routes/auth.routes");


const healthRoutes = require("./routes/health.routes");

function createApp() {
    const app = express();

    // core middleware
    app.use(helmet());
    app.use(cors({ origin: true, credentials: true }));
    app.use(express.json({ limit: "1mb" }));
    app.use(morgan("dev"));

    // routes
    app.use("/health", healthRoutes);
    app.use("/api/auth", authRoutes);


    // 404
    app.use((req, res) => {
        res.status(404).json({ error: "Not Found" });
    });

    // error handler
    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, next) => {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    });

    return app;
}

module.exports = { createApp };
