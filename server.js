var express = require("express");
var app = express();
app.use(express.json())
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
 console.log("Server running on port 3000");
});
app.get("", (req, res, next) => {
  res.json(["Hello World"]);
});
app.get("/hello", (req, res, next) => {
  if (req.query.nom) { res.json(["Bonjour, ", req.query.nom, " !"]); }
  else{ res.json(["Quel est votre nom ?"]); }
});
app.post("/chat", function(req , res){
  if(req.body.msg == "ville") { res.json(["Nous sommes à Paris"]); }
  else if(req.body.msg == "météo") { res.json(["Il fait beau"]); }
});
