"use strict";

const POPPER_WIDTH = 300;
const POPPER_HEIGHT = 450;
const popperContainer = document.querySelector("#popper-container");
const popper = document.querySelector("#popper");
const addNodesContainer = document.querySelector("#add-nodes");
const nodeOptionsContainer = document.querySelector("#node-options-container");

const initialNodes = [
  {
    data: {
      label: "Customer's Dynamic Credit Limit Determination",
      id: "root-node",
    },
  },
  {
    data: { label: "Application data", id: "application-data" },
  },
  {
    data: { label: "Income level", id: "income-level" },
  },
  {
    data: { label: "Employment Status", id: "employment-status" },
  },
  {
    data: { label: "Marketing", id: "marketing" },
  },
  {
    data: { label: "Account Data", id: "account-data" },
  },
  {
    data: { label: "Debt-to-Income Ratio", id: "debt-to-income-ratio" },
  },
  {
    data: { label: "Existing Debt Levels", id: "existing-debt-levels" },
  },
  {
    data: { label: "Payment History", id: "payment-history" },
  },
  {
    data: { label: "Utilization Ratio", id: "utilization-ratio" },
  },
  {
    data: { label: "Banking Relationship", id: "banking-relationship" },
  },
  {
    data: { label: "New Idea", id: "new-idea" },
  },
];

let nodesLength = initialNodes.length;

const initialEdges = [
  {
    data: { target: "application-data", source: "root-node" },
  },
  { data: { target: "account-data", source: "root-node" } },
  {
    data: { source: "application-data", target: "income-level" },
  },
  {
    data: { source: "application-data", target: "employment-status" },
  },
  {
    data: { source: "application-data", target: "marketing" },
  },
  {
    data: { source: "account-data", target: "debt-to-income-ratio" },
  },
  {
    data: { source: "account-data", target: "existing-debt-levels" },
  },
  {
    data: { source: "account-data", target: "payment-history" },
  },
  {
    data: { source: "account-data", target: "utilization-ratio" },
  },
  {
    data: { source: "account-data", target: "banking-relationship" },
  },
  {
    data: { source: "account-data", target: "new-idea" },
  },
];

function getAllConnectedNodes(node) {
  let connectedNodes = [];
  const uniqueIds = [];

  function traverse(node) {
    let successors = node.successors();
    successors.forEach((node) => {
      if (!uniqueIds.includes(node.data("id"))) {
        connectedNodes.push(node);
        uniqueIds.push(node.data("id"));
      }
    });

    successors.forEach((succ) => {
      traverse(succ);
    });
  }

  traverse(node);

  return connectedNodes;
}

const isEdgeFromParent = (edgeNode, parentNodeIds) => {
  return parentNodeIds.includes(edgeNode.source()?.data("id"));
};
const isNodeParent = (node, parentNodeIds) => {
  return parentNodeIds.includes(node.data("id"));
};
const handleNodeClick = (e) => {
  const node = e.target;
  const connectedNodes = getAllConnectedNodes(node);

  connectedNodes.forEach((node) => {
    if (node.visible()) {
      node.hide();
    } else {
      node.show();
    }
  });
};

let currentSelectedNode = null;
const handleNodeRightClick = (e) => {
  showPopper(e.originalEvent.x, e.originalEvent.y);
  currentSelectedNode = e.target;
  console.log(currentSelectedNode);
};
const layoutOptions = {
  name: "breadthfirst",
  fit: true,
  directed: true,
  padding: 20,
  circle: false,
  avoidOverlap: true,
  spacingFactor: 2,
  nodeDimensionsIncludeLabels: false,
  root: "root-node",
  ready: undefined,
  stop: undefined,
  transform: function (node, position) {
    return position;
  },
};
const tree = cytoscape({
  container: document.getElementById("nodes"), // container to render in
  layout: layoutOptions,
  elements: [...initialNodes, ...initialEdges], // list of graph elements to start with
  style: [
    {
      selector: "node",
      style: {
        "background-color": "#666",
        label: "data(label)",
      },
    },
    {
      selector: "edge",
      style: {
        width: 3,
        "line-color": "#ccc",
        "target-arrow-color": "#ccc",
        "target-arrow-shape": "triangle",
        "curve-style": "bezier",
        "text-margin-y": -15,
      },
    },
  ],
});

const hidePopper = () => {
  popperContainer.classList.remove("visible");
  popper.classList.remove("visible");
};

const showPopper = (x, y) => {
  let horizontalSpace = "right",
    verticalSpace = "bottom";

  if (x + POPPER_WIDTH > window.innerWidth) {
    if (x - POPPER_WIDTH > 0) {
      horizontalSpace = "left";
    } else {
      horizontalSpace = "none";
    }
  }

  if (y + POPPER_HEIGHT > window.innerHeight) {
    if (y - POPPER_HEIGHT > 0) {
      verticalSpace = "top";
    } else {
      verticalSpace = "none";
    }
  }

  let finalX = x,
    finalY = y;

  switch (horizontalSpace) {
    case "left":
      finalX -= POPPER_WIDTH;
      break;
    case "none":
      finalX = 0;
      break;
  }

  switch (verticalSpace) {
    case "top":
      finalY -= POPPER_HEIGHT;
      break;
    case "none":
      finalY = 0;
      break;
  }

  popper.classList.add("visible");
  popperContainer.classList.add("visible");
  popper.style.top = `${finalY}px`;
  popper.style.left = `${finalX}px`;
};
const getElementFromEvent = (e, maxDepth = 1) => {
  let element = e.target;
  if (e.target.classList.contains("fa")) {
    element = e.target.parentElement;
  }
  return element;
};
const handleAddNode = (e) => {
  const element = getElementFromEvent(e);
  const type = element.dataset.nodeType;
  // TODO: Switch to generating id using uuid
  const id = "new-node" + nodesLength++;
  const pos = currentSelectedNode.position();
  tree.add({
    data: { id, label: "New Node", type },
    position: { x: pos.x, y: pos.y + 100 },
  });
  if (currentSelectedNode) {
    tree.add({
      data: {
        source: currentSelectedNode.data("id"),
        target: id,
      },
    });
  }
  hidePopper();
  tree.layout(layoutOptions).run();
};

const handleEditOptions = (e) => {
  let element = getElementFromEvent(e);
  if (element.dataset.option === "edit") {
    const name = window.prompt(
      "Enter a new name for this node",
      currentSelectedNode.data("label")
    );
    if (name) {
      currentSelectedNode.data("label", name);
    }
  }
  hidePopper();
};

/** All event listeners here */
popperContainer.addEventListener("click", hidePopper);
addNodesContainer.addEventListener("click", handleAddNode);
nodeOptionsContainer.addEventListener("click", handleEditOptions);

tree.on("click", "node", handleNodeClick);
tree.on("cxttap", "node", handleNodeRightClick);
