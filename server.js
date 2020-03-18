const fs = require('fs')
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dbAdmin:dbAdmin1@cluster0-ne7rk.azure.mongodb.net/test?retryWrites=true&w=majority";   // URL of the DataBase
const client = new MongoClient(uri, { useNewUrlParser: true });
app.use(express.json()) // for parsing application/json

const PORT = process.env.PORT || 3000;

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/hello', function (req, res) {
  const nom = req.query.nom
  if (nom) {
    res.send('Bonjour, ' + nom + ' !')
  } else {
    res.send('Quel est votre nom ?')
  }
})

app.get('/messages/all', function (req, res) {
  client.connect(async err => {
    const collection = client.db("chat-bot").collection("messages");
    const allMessage = await collection.find({}).toArray();
    console.log("recup all msg : ",allMessage);
    res.send(allMessage);
    client.close();
  });
});

app.get('/messages/last', function (req, res) {
  client.connect(async err => {
    const collection = client.db("chat-bot").collection("messages");
    const allMessage = await collection.find({}).toArray();
    console.log("recup dernier msg : ",allMessage[allMessage.length-1]);
    res.send(allMessage[allMessage.length-1]);
    client.close();
  });
});

app.delete('/messages/last', function (req, res) {
  console.log("connecting to the db for delete")
  client.connect(async err => {
    console.log("get collection")
    const collection = client.db("chat-bot").collection("messages");
    console.log("get documents")
    var allMessage = await collection.find({}).toArray();
    console.log("tout les message before delete : ", allMessage);
    const idMsg1 = allMessage[allMessage.length-1]._id;
    const idMsg2 = allMessage[allMessage.length-2]._id;
    console.log("id message 1 : ", idMsg1);
    console.log("id message 2 : ", idMsg2);
    const d = await collection.deleteOne({_id: idMsg1});
    const d1 = await collection.deleteOne({_id: idMsg2});
    allMessage = await collection.find({}).toArray();
    console.log("tout les message after delete : ", allMessage);
    client.close();
  });
});

app.post('/chat', function (req, res) {
  console.log("going to connect mongodb")
  client.connect(async err => {
    console.log("connected to mongodb")
    const collection = client.db("chat-bot").collection("messages");
    if (req.body.msg === 'ville') {
      let r = await collection.insertMany([{from: 'user', msg: req.body.msg}, {from: 'bot', msg: 'Nous sommes à Paris'}]);      // Insert de lhistorique de la conversation
      res.send('Nous sommes à Paris')
    } else if (req.body.msg === 'météo') {
      let r = await collection.insertMany([{from: 'user', msg: req.body.msg}, {from: 'bot', msg: 'Il fait beau'}]);             // Insert de lhistorique de la conversation
      res.send('Il fait beau')
    } else {
      if (/ = /.test(req.body.msg)) {
        const [ cle, valeur ] = req.body.msg.split(' = ')
        const valeursExistantes = readValuesFromFile();
        console.log("writeValue")
        fs.writeFileSync('/Users/vidalleo/Documents/ESGI/NodeJs/Exercice1/NodeJs-Exercice1/reponse.json', JSON.stringify({
          ...valeursExistantes,
          [cle]: valeur
        }))
        let r = await collection.insertMany([{from: 'user', msg: req.body.msg}, {from: 'bot', msg: 'Merci pour cette information !'}]);     // Insert de lhistorique de la conversation
        res.send('Merci pour cette information !')
      } else {
        const cle = req.body.msg
        const reponse = readValuesFromFile()[cle]
        let r = await collection.insertMany([{from: 'user', msg: req.body.msg}, {from: 'bot', msg: cle + ': ' + reponse}]);     // Insert de lhistorique de la conversation
        res.send(cle + ': ' + reponse)
      }
    }
    client.close();
  });
})

app.listen(PORT, function () {
  console.log('Example app listening on port ' + PORT)
})

function readValuesFromFile() {
  const reponses = fs.readFileSync('/Users/vidalleo/Documents/ESGI/NodeJs/Exercice1/NodeJs-Exercice1/reponse.json', { encoding: 'utf8' });
  const valeursExistantes = JSON.parse(reponses);
  return valeursExistantes;
}
