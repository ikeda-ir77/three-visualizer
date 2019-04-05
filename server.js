const express = require("express");
const path = require('path');
const app = express();
const http = require('http').Server(app);
const session = require('express-session');
const history = require('connect-history-api-fallback');
require('dotenv').config();

app.use(express.static("assets/"));
app.use(express.static("dist/"));
app.use(history());
app.get("*", (request, response) => {
  response.status(200).sendFile(path.join(__dirname, 'dist/'));
});

app.listen(3000);
