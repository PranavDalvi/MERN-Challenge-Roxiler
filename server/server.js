require("dotenv").config();
const express = require('express');
const app = express();
const router = require("./router/auth-router")
const connectDb = require("./utils/db")

app.use(express.json())
app.use("/api", router);

const PORT = process.env.PORT;

connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`server is running at port: ${PORT}`)
    })
})

