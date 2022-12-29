var express = require('express');

var app = module.exports = express();

 app.disable("x-powered-by");

 app.get('/yes', (req, res) => {
  res.send('Hello World!')
})
// This line is important. What we are doing here is exporting ONE function with the name
// `api` which will always route
exports.api = functions.https.onRequest(app);