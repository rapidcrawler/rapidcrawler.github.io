const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

dotenv.config();

const DB_CONNECTION_STRING = `${process.env.DB_CONNECTION_STRING}`;

mongoose.connect(DB_CONNECTION_STRING);

const { nodeModel, edgeModel } = require("./models");

app.use(cors({ origin: "*" }));
app.use(bodyParser.json({ strict: false }));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/nodes", async (req, res) => {
  res.json(await nodeModel.find({}));
});

app.get("/edges", async (req, res) => {
  res.json(await edgeModel.find({}));
});

app.post("/nodes", async (req, res) => {
  const nodeData = req.body.node;
  if (
    !nodeData ||
    !nodeData.data ||
    !nodeData.data.label ||
    !nodeData.data.id ||
    !nodeData.data.type
  ) {
    res.status(400).json({ message: "Malformed data" });
    return;
  }
  try {
    const newNode = new nodeModel(nodeData);
    await newNode.save();
    res.json({ message: "Success" });
  } catch (err) {
    console.error(err);
    res.status(500).json("Internal server error");
  }
});

app.delete("/nodes/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await nodeModel.findOneAndDelete({ data: { id } });
    res.status(200).json({ message: "Success" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/edges", async (req, res) => {
  try {
    const edgeData = req.body.edge;
    if (
      !edgeData ||
      !edgeData.data.source ||
      !edgeData.data.target ||
      !edgeData.data.id
    ) {
      res.status(400).json({ message: "Malformed data" });
      return;
    }
    const newEdge = new edgeModel(edgeData);
    await newEdge.save();
    res.json({ message: "Success" });
  } catch (err) {
    console.error(err);
    res.status(500).json("Internal server error");
  }
});

app.delete("/edges/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await nodeModel.findOneAndDelete({ data: { id } });
    res.status(200).json({ message: "Success" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/nodes/:id", async (req, res) => {
  const nodeData = req.body.node;
  if (!nodeData.label && !nodeData.type) {
    res.status(400).json({
      message:
        "'label' or 'type' needs to be defined. Only they can be updated.",
    });
    return;
  }
  const id = req.params.id;
  try {
    const node = await nodeModel.findOne({ "data.id": { $eq: id } }).exec();
    if (nodeData.type) {
      node.data.type = nodeData.type;
    }
    if (nodeData.label) {
      node.data.label = nodeData.label;
    }
    await node.save();
    res.json({ message: "Success" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});
