

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dbAdmin:dbAdmin1@cluster0-ne7rk.azure.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(async err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  const dates = await collection.find({}).limit(2).toArray();
  console.log("dates: ", dates);

  let r = await collection.insertOne({date: new Date()});
  console.log("response : ", r);
  const datesAfter = await collection.find({}).limit(2).toArray();
  console.log("dates after insert: ", dates);
  client.close();
});






/*const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

(async function() {
  // Connection URL
  const url = 'mongodb+srv://cluster0-ne7rk.azure.mongodb.net/test';
  // Database Name
  const dbName = 'Cluster0';
  const client = new MongoClient(url);

  try {
    // Use connect method to connect to the Server
    await client.connect();

    const db = client.db();
    const col = db.collection('find');
    console.log(col);

    let r = await db.collection('inserts').insertOne({date: new Date()});
    //assert.equal(1, r.insertedCount);

    console.log(db.collection('find'));
  } catch (err) {
    console.log(err.stack);
  }

  client.close();
})();*/
