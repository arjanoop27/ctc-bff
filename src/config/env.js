const dotenv = require("dotenv");
dotenv.config();

const env = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: Number(process.env.PORT || 4000),
    MONGODB_URI: process.env.MONGODB_URI || "",
    JWT_SECRET: process.env.JWT_SECRET || "dev-secret-change-me"
};

module.exports = { env };
