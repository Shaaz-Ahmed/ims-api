const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mySqlPool = require("./config/db");

// Configure dotenv
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use('/api/v1/ims/users', require('./routes/ismRoutes'));  

// Test route
app.get("/test", (req, res) => {
    res.status(200).send("<h1>Nodejs MySQL App</h1>");
});

// Port Configuration
const PORT = process.env.PORT || 8080;

// Conditional server start after MySQL connection check
mySqlPool.query("SELECT 1").then(() => {
    console.log("MySQL DB Connected".bgCyan.white);

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server Running on port ${process.env.PORT}`.bgMagenta.white);
    });
}).catch((error) => {
    console.log(error);
});
