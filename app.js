const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const router = express.Router();
const PORT = 4000;
const configs = require('./configs');

let User = require('./models/user');

// ALL ROUTES PATH
var authRoutes   = require("./routes/auth.js");
var dashboardRoutes = require("./routes/dashboard");
// var productRoutes = require("./routes/products.js");
// var commentRoutes = require("./routes/comments.js");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(`${configs.mongoDB.baseURL}`, { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

router.get("*", function(req, res){
    res.status(400).json({ result: "failed" ,error: "Page not available! please visit home page!"});
});

// REQUIREING ROUTES
// app.use('/', router);
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
// app.use("/products", productRoutes);
// app.use("/products/:id/comments", commentRoutes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});