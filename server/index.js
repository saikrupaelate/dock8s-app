const express = require('express');
const dotenv = require('dotenv');
const ConnectDB = require('./db/ConnectDB');
const app = express();
const router = require('./routes/DBOperRoutes');
const userRouter = require('./routes/userRoutes'); // Add this line
const bodyParser = require('body-parser');
const cors = require("cors");
// const client = require('prom-client');

dotenv.config();

const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Prometheus metrics setup
// const collectDefaultMetrics = client.collectDefaultMetrics;
// collectDefaultMetrics();

// app.get("/metrics", async (req, res) => {
//   res.set("Content-Type", client.register.contentType);
//   res.end(await client.register.metrics());
// });

let pool;

(async () => {
    pool = await ConnectDB();

    // Attach pool to requests
    app.use((req, res, next) => {
        req.pool = pool;
        next();
    });

    app.use("/", router);
    app.use("/", userRouter); // Add this line  

    app.listen(port, () => {
        console.log(`Backend listening on port http://localhost:${port}`);
    });

    app.get('/', (req, res) => {
        res.json({ message: "Hello from the backend!" });
    });    
})();
