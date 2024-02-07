const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const DB_CONNECTION_STRING = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8gz2ol3.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(DB_CONNECTION_STRING);

const { nodeModel, edgeModel } = require("./models");


const { nodes, edges } = require("./defaultNodes.json");
const init = async () => {
  let initNodeCount = 0;
  let initEdgeCount = 0;
  for (const node of nodes) {
    await new nodeModel(node).save();
    initNodeCount++;
  }
  for (const edge of edges) {
    await new edgeModel(edge).save();
    initEdgeCount++;
  }
  console.log({ initNodeCount, initEdgeCount });
};

init().then(() => {
  console.log("init completed");
  process.exit(0);
});
