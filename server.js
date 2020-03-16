var express = require("express");
var app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
 console.log("Server running on port 3000");
});

app.get("", (req, res, next) => {
  res.json(["Hello World"]);
});
