const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();

app.use(cors());

app.get("/", (req, res) => {
  res.send(`Server is Running on Port ${port}`);
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.f1cm5cm.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const nodeCollection = client.db("techWeirdo").collection("nodes");

    await nodeCollection.insertMany([
      { value: "A", left: null, right: null },
      { value: "B", left: null, right: null },
      { value: "C", left: null, right: null },
      { value: "D", left: null, right: null },
      { value: "E", left: null, right: null },
    ]);

    app.get("/bfs/:startNode", async (req, res) => {
      const startNodeValue = req.params.startNode;
      const queue = [startNodeValue];
      const visited = new Set();

      while (queue.length > 0) {
        const currentNodeValue = queue.shift();
        visited.add(currentNodeValue);

        // Perform some action on the current node
        console.log(`Visiting node: ${currentNodeValue}`);

        // Add the children of the current node to the queue
        const currentNode = await nodeCollection.findOne({
          value: currentNodeValue,
        });
        if (currentNode.left) {
          queue.push(currentNode.left);
        }
        if (currentNode.right) {
          queue.push(currentNode.right);
        }
      }

      res.send("BFS complete");
    });
  } finally {
  }
}

run().catch((err) => console.log(err));

app.listen(port, () => console.log(`Server is running on Port ${port}`));
