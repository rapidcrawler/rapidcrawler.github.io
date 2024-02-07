const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const nodeSchema = new Schema({
  data: {
    label: { type: String },
    id: { type: String },
    type: { type: String },
  },
});

const edgeSchema = new Schema({
  data: {
    target: { type: String },
    source: { type: String },
  },
});

const nodeModel = new model("nodes", nodeSchema);
const edgeModel = new model("edges", edgeSchema);
module.exports = {
  nodeModel,
  edgeModel,
};
