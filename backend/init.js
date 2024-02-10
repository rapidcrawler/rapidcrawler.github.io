const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const DB_CONNECTION_STRING = `${process.env.DB_CONNECTION_STRING}`;

mongoose.connect(DB_CONNECTION_STRING);

const { nodeModel, edgeModel } = require("./models");

const { nodes, edges } = require("./defaultNodes.json");
const init = async () => {
  let addedNodesCount = 0;
  let addedEdgesCount = 0;
  const { deletedCount: deletedNodesCount } = await nodeModel.deleteMany({});
  const { deletedCount: deletedEdgesCount } = await edgeModel.deleteMany({});

  for (const node of nodes) {
    await new nodeModel(node).save();
    addedNodesCount++;
  }
  for (const edge of edges) {
    await new edgeModel(edge).save();
    addedEdgesCount++;
  }
  console.log({
    deletedEdgesCount,
    deletedNodesCount,
    addedNodesCount,
    addedEdgesCount,
  });
};

init().then(() => {
  console.log("init completed");
  process.exit(0);
});
