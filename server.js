var express = require("express");
var fs = require('fs');
var app = express();
app.use(express.json())
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
 console.log("Server running on port 3000 !");
});
app.get("", (req, res, next) => {
  res.json(["Hello World"]);
});
app.get("/hello", (req, res, next) => {
  if (req.query.nom) { res.json(["Bonjour, ", req.query.nom, " !"]); }
  else{ res.json(["Quel est votre nom ?"]); }
});

app.post("/chat", function(req , res){
  if(req.body.msg == "ville") {
    res.json(["Nous sommes à Paris"]);
  }
  else if(req.body.msg == "météo"){
     res.json(["Il fait beau"]);
  }else{
    if(req.body.msg.includes('=')){
      const word = req.body.msg.split("=");
      const keyValue = "{" + word[0] + ": " + word[1] + "}";
      console.log("write msg");
      fs.writeFileSync("/Users/vidalleo/Documents/ESGI/NodeJs/Exercice1/NodeJs-Exercice1/reponse.json", keyValue); // écris hello dans le fichier response.json
      res.json(["Merci pour cette information !"]);
    }else{
      var contentFile = fs.readFileSync('/Users/vidalleo/Documents/ESGI/NodeJs/Exercice1/NodeJs-Exercice1/reponse.json', 'utf8');
      console.log("fichier : ",contentFile);
      if(contentFile.includes(req.body.msg)){
        console.log("retourne la key value");
        const response = contentFile.substring(1, contentFile.length - 1);
        res.json([response]);
      }else{
        console.log("retourne rien");
        const response = "Je ne connais pas " + req.body.msg + " ...";
        res.json([response]);
      }

    }


  }
});
