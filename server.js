var express = require("express");
var app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
 console.log("Server running on port 3000");
});

app.get("", (req, res, next) => {
  res.json(["Hello World"]);
});

/*app.get("/hello?:nom", (req, res, next) => {
  res.json(["Quel est votre nom ?"]);
});*/


app.get("/hello", (req, res, next) => {
  if(req.query.nom){
    res.json(["Bonjour, ", req.query.nom, " !"]);
  }else{
    res.json(["Quel est votre nom ?"]);
  }
});
