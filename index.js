const express = require("express");
const db = require("./config/connection");
const routes = require("./routes");

// Set up port and initialize express app
const port = process.env.PORT || 3001;
const app = express();

// Set up middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

// Connect to database and server
db.once("open", () => {
  app.listen(port, () => {
    console.log(`API server running on port ${port}!`);
  });
});
