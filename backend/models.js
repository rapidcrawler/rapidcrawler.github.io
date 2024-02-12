const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const nodeSchema = new Schema({
  data: {
    label: { type: String, required: true },
    id: { type: String, required: true },
    type: {
      type: String,
      enum: ["assumption", "datapoints", "questions"],
    },
  },
});

const edgeSchema = new Schema({
  data: {
    id: { type: String, required: true },
    target: { type: String, required: true },
    source: { type: String, required: true },
  },
});

const nodeModel = new model("nodes", nodeSchema);
const edgeModel = new model("edges", edgeSchema);
module.exports = {
  nodeModel,
  edgeModel,
};
