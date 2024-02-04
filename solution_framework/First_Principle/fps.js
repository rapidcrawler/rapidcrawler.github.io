"use strict";

let childrenHiddenNodes = [];
const baseURL = "http://localhost:4000";
const POPPER_WIDTH = 300;
const POPPER_HEIGHT = 450;
const popperContainer = document.querySelector("#popper-container");
const popper = document.querySelector("#popper");
const addNodesContainer = document.querySelector("#add-nodes");
const nodeOptionsContainer = document.querySelector("#node-options-container");

/**
 * Make a request to the back-end
 * @param {ReqObject} param0 Request object
 * @returns {Promise}
 */
const request = async ({ method, url, data }) => {
  try {
    const _baseURL =
      baseURL[baseURL.length - 1] === "/" ? baseURL.slice(0, -1) : baseURL;
    const _url = url[0] === "/" ? url : "/" + url;

    const res = await fetch(`${_baseURL}${_url}`, {
      method,
      body: JSON.stringify(data),
      headers: { ...this.commonHeaders },
    });
    if (res.status >= 400) {
      const json = await res.json();
      throw {
        status: res.status,
        message: json.message ?? res.message ?? res.statusText,
      };
    }
    if (res.headers.get("content-length") !== "0") return res.json();
  } catch (_err) {
    throw err;
  }
};

const initialNodes = [
  {
    data: {
      label: "Customer's Dynamic Credit Limit Determination",
      id: "root-node",
    },
  },
  {
    data: {
      type: "lightbulb",
      label: "Application data",
      id: "application-data",
    },
  },
  { data: { type: "lightbulb", label: "Income level", id: "income-level" } },
  {
    data: {
      type: "lightbulb",
      label: "Employment Status",
      id: "employment-status",
    },
  },
  { data: { type: "lightbulb", label: "Marketing", id: "marketing" } },
  { data: { type: "lightbulb", label: "Account Data", id: "account-data" } },
  {
    data: {
      type: "lightbulb",
      label: "Debt-to-Income Ratio",
      id: "debt-to-income-ratio",
    },
  },
  {
    data: {
      type: "lightbulb",
      label: "Existing Debt Levels",
      id: "existing-debt-levels",
    },
  },
  {
    data: {
      type: "lightbulb",
      label: "Payment History",
      id: "payment-history",
    },
  },
  {
    data: {
      type: "lightbulb",
      label: "Utilization Ratio",
      id: "utilization-ratio",
    },
  },
  {
    data: {
      type: "lightbulb",
      label: "Banking Relationship",
      id: "banking-relationship",
    },
  },
  { data: { type: "lightbulb", label: "New Idea", id: "new-idea" } },
  { data: { type: "lightbulb", label: "Personal Data", id: "personal-data" } },
  { data: { type: "lightbulb", label: "Age", id: "age" } },
  { data: { type: "lightbulb", label: "Gender", id: "gender" } },
  {
    data: { type: "lightbulb", label: "Marital Status", id: "marital-status" },
  },
  {
    data: {
      type: "lightbulb",
      label: "Credit Bureau data",
      id: "credit-bureau-data",
    },
  },
  { data: { type: "lightbulb", label: "Credit Report", id: "credit-report" } },
  { data: { type: "lightbulb", label: "Credit Score", id: "credit-score" } },
  {
    data: { type: "lightbulb", label: "Credit History", id: "credit-history" },
  },
  {
    data: {
      type: "lightbulb",
      label: "Recent credit inquiries",
      id: "recent-credit-inquiries",
    },
  },
  {
    data: {
      type: "lightbulb",
      label: "Regulatory requirements",
      id: "regulatory-requirements",
    },
  },
  { data: { type: "lightbulb", label: "Team 1", id: "team-1" } },
  { data: { type: "lightbulb", label: "Team 2", id: "team-2" } },
  { data: { type: "lightbulb", label: "Team 3", id: "team-3" } },
];

let nodesLength = initialNodes.length;

const initialEdges = [
  { data: { target: "application-data", source: "root-node" } },
  { data: { target: "account-data", source: "root-node" } },
  { data: { source: "application-data", target: "income-level" } },
  { data: { source: "application-data", target: "employment-status" } },
  { data: { source: "application-data", target: "marketing" } },
  { data: { source: "account-data", target: "debt-to-income-ratio" } },
  { data: { source: "account-data", target: "existing-debt-levels" } },
  { data: { source: "account-data", target: "payment-history" } },
  { data: { source: "account-data", target: "utilization-ratio" } },
  { data: { source: "account-data", target: "banking-relationship" } },
  { data: { source: "account-data", target: "new-idea" } },
  { data: { source: "root-node", target: "personal-data" } },
  { data: { source: "personal-data", target: "age" } },
  { data: { source: "personal-data", target: "gender" } },
  { data: { source: "personal-data", target: "marital-status" } },
  { data: { source: "root-node", target: "credit-bureau-data" } },
  { data: { source: "credit-bureau-data", target: "credit-report" } },
  { data: { source: "credit-bureau-data", target: "regulatory-requirements" } },
  { data: { source: "credit-report", target: "credit-score" } },
  { data: { source: "credit-report", target: "credit-history" } },
  { data: { source: "credit-report", target: "recent-credit-inquiries" } },
  { data: { source: "regulatory-requirements", target: "team-1" } },
  { data: { source: "regulatory-requirements", target: "team-2" } },
  { data: { source: "regulatory-requirements", target: "team-3" } },
];

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
  userZoomingEnabled: false,
  elements: [...initialNodes, ...initialEdges], // list of graph elements to start with
  style: [
    {
      selector: "node",
      style: {
        label: "data(label)",
        "background-color": "#000", // Set the background color to white
        "background-opacity": 1, // Make the background color transparent
        "text-valign": "bottom", // Align the icon to the bottom of the node
        "text-halign": "center", // Center the icon horizontally
        "font-size": 24, // Set the font size of the icon
        "font-family": "FontAwesome", // Set the font family to Font Awesome
        "text-color": "black",
        "background-image": function (ele) {
          const type = ele.data("type");
          console.log({ type });
          switch (type) {
            case "lightbulb":
              return "\uf007";
            case "database":
              return "url(https://picsum.photos/132)";
            // more cases...
            default:
              return "url(/path/to/defaultImage.png)";
          }
        },
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
        "edge-distances": "node-position",
      },
    },
  ],
});

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

const handleExpandNode = (node) => {
  const connectedNodes = getAllConnectedNodes(node);

  connectedNodes.forEach((node) => {
    node.show();
  });
};

const handleCollapseNode = (node) => {
  const connectedNodes = getAllConnectedNodes(node);
  connectedNodes.forEach((node) => {
    node.hide();
  });
};

const toggleNodeChildren = (node) => {
  let shouldHide = false;

  if (!childrenHiddenNodes.includes(node.data("id"))) {
    childrenHiddenNodes.push(node.data("id"));
    shouldHide = true;
  } else {
    childrenHiddenNodes = childrenHiddenNodes.filter(
      (id) => id !== node.data("id")
    );
  }

  if (shouldHide) {
    handleCollapseNode(node);
  } else {
    handleExpandNode(node);
  }
};

const handleNodeClick = (e) => {
  const node = e.target;
  toggleNodeChildren(node);
};

const enableZoomOnCtrlKeyDown = (e) => {
  // console.log({ e });
  if (e.key.toLowerCase() === "control" || e.key.toLowerCase() === "command") {
    tree.userZoomingEnabled(true);
  }
};
const disableZoomOnCtrlKeyup = (e) => {
  if (e.key.toLowerCase() === "control" || e.key.toLowerCase() === "command") {
    tree.userZoomingEnabled(false);
  }
};

const handleMouseOver = () => {
  // console.log("mouseover");
  window.addEventListener("keydown", enableZoomOnCtrlKeyDown);
  window.addEventListener("keyup", disableZoomOnCtrlKeyup);
};
const handleMouseOut = () => {
  // console.log("mouseout");
  window.removeEventListener("keydown", enableZoomOnCtrlKeyDown);
  window.removeEventListener("keyup", disableZoomOnCtrlKeyup);
};

let currentSelectedNode = null;
const handleNodeRightClick = (e) => {
  e.preventDefault();
  showPopper(e.originalEvent.x, e.originalEvent.y);
  currentSelectedNode = e.target;
};
const handleCanvasRightClick = (e) => {
  e.preventDefault();
  showPopper(e.originalEvent.x, e.originalEvent.y);
};

const hidePopper = () => {
  popperContainer.classList.remove("visible");
  popper.classList.remove("visible");
  currentSelectedNode = undefined;
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
  let newNodePosition;
  if (currentSelectedNode) {
    const pos = currentSelectedNode.position();
    newNodePosition = { x: pos.x, y: pos.y + 100 };
  }
  tree.add({
    data: { id, label: "New Node", type },
    position: newNodePosition,
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

const handleRenameNode = () => {
  const name = window.prompt(
    "Enter a new name for this node",
    currentSelectedNode.data("label")
  );
  if (name) {
    currentSelectedNode.data("label", name);
  }
};

const handleDeleteNode = () => {
  const isConfirmed = window.confirm(
    "Are you sure you want to delete this node?"
  );
  if (isConfirmed) {
    currentSelectedNode.remove();
  }
};

const handleCollapseAll = () => {
  const root = tree.getElementById("root-node");

  handleCollapseNode(root);
  hidePopper();
};

const handleExpandAll = () => {
  const root = tree.getElementById("root-node");
  handleExpandNode(root);
  hidePopper();
};

const handleEditOptions = (e) => {
  let element = getElementFromEvent(e);
  switch (element.dataset.option) {
    case "rename":
      handleRenameNode();
      break;
    case "delete":
      handleDeleteNode();
      break;
    case "expand":
      handleExpandNode(currentSelectedNode);
      break;
    case "expand-all":
      handleExpandAll();
      break;
    case "collapse":
      handleCollapseNode(currentSelectedNode);
      break;
    case "collapse-all":
      handleCollapseAll();
      break;
    default:
      console.error(`${element.dataset.option} is not handled`);
  }

  hidePopper();
};

const handleNodeChange = (e) => {
  console.log({ e });
};

/** All event listeners here */
popperContainer.addEventListener("click", hidePopper);
addNodesContainer.addEventListener("click", handleAddNode);
nodeOptionsContainer.addEventListener("click", handleEditOptions);

tree.on("click", "node", handleNodeClick);
tree.on("cxttap", "node", handleNodeRightClick);
// tree.on("cxttap", handleCanvasRightClick);
tree.on("change", "node", handleNodeChange);

tree.on("mouseover", handleMouseOver);
tree.on("mouseout", handleMouseOut);