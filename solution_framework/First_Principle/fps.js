"use strict";

const spinnerContainer = document.querySelector("#spinner-container");
const spinnerControl = new Proxy(
  { isShown: false },
  {
    set(target, prop, value) {
      if (value) {
        spinnerContainer.classList.add("visible");
      } else {
        spinnerContainer.classList.remove("visible");
      }

      target[prop] = value;
      return true;
    },
  }
);

const dialogContainer = document.querySelector("#dialog-container");
const dialog = document.querySelector("#dialog-container .dialog");
const dialogControl = new Proxy(
  { isShown: false },
  {
    set(target, prop, value) {
      if (value) {
        dialogContainer.classList.add("visible");
      } else {
        dialogContainer.classList.remove("visible");
      }

      target[prop] = value;
      return true;
    },
  }
);

let childrenHiddenNodes = [];
const baseURL = "http://localhost:4000";
const POPPER_WIDTH = 300;
const POPPER_HEIGHT = 450;
const popperBg = document.querySelector("#popper-bg");
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
      type: "lightbulb",
    },
  },
  {
    data: {
      type: "database",
      label: "Application data",
      id: "application-data",
    },
  },
  { data: { type: "lightbulb", label: "Income level", id: "income-level" } },
  {
    data: {
      type: "question",
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
      type: "question",
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
  {
    data: {
      source: "root-node",
      target: "application-data",
      id: "root-node-application-data",
    },
  },
  {
    data: {
      source: "root-node",
      target: "account-data",
      id: "root-node-account-data",
    },
  },
  {
    data: {
      source: "application-data",
      target: "income-level",
      id: "application-data-income-level",
    },
  },
  {
    data: {
      source: "application-data",
      target: "employment-status",
      id: "application-data-employment-status",
    },
  },
  {
    data: {
      source: "application-data",
      target: "marketing",
      id: "application-data-marketing",
    },
  },
  {
    data: {
      source: "account-data",
      target: "debt-to-income-ratio",
      id: "account-data-debt-to-income-ratio",
    },
  },
  {
    data: {
      source: "account-data",
      target: "existing-debt-levels",
      id: "account-data-existing-debt-levels",
    },
  },
  {
    data: {
      source: "account-data",
      target: "payment-history",
      id: "account-data-payment-history",
    },
  },
  {
    data: {
      source: "account-data",
      target: "utilization-ratio",
      id: "account-data-utilization-ratio",
    },
  },
  {
    data: {
      source: "account-data",
      target: "banking-relationship",
      id: "account-data-banking-relationship",
    },
  },
  {
    data: {
      source: "account-data",
      target: "new-idea",
      id: "account-data-new-idea",
    },
  },
  {
    data: {
      source: "root-node",
      target: "personal-data",
      id: "root-node-personal-data",
    },
  },
  { data: { source: "personal-data", target: "age", id: "personal-data-age" } },
  {
    data: {
      source: "personal-data",
      target: "gender",
      id: "personal-data-gender",
    },
  },
  {
    data: {
      source: "personal-data",
      target: "marital-status",
      id: "personal-data-marital-status",
    },
  },
  {
    data: {
      source: "root-node",
      target: "credit-bureau-data",
      id: "root-node-credit-bureau-data",
    },
  },
  {
    data: {
      source: "credit-bureau-data",
      target: "credit-report",
      id: "credit-bureau-data-credit-report",
    },
  },
  {
    data: {
      source: "credit-bureau-data",
      target: "regulatory-requirements",
      id: "credit-bureau-data-regulatory-requirements",
    },
  },
  {
    data: {
      source: "credit-report",
      target: "credit-score",
      id: "credit-report-credit-score",
    },
  },
  {
    data: {
      source: "credit-report",
      target: "credit-history",
      id: "credit-report-credit-history",
    },
  },
  {
    data: {
      source: "credit-report",
      target: "recent-credit-inquiries",
      id: "credit-report-recent-credit-inquiries",
    },
  },
  {
    data: {
      source: "regulatory-requirements",
      target: "team-1",
      id: "regulatory-requirements-team-1",
    },
  },
  {
    data: {
      source: "regulatory-requirements",
      target: "team-2",
      id: "regulatory-requirements-team-2",
    },
  },
  {
    data: {
      source: "regulatory-requirements",
      target: "team-3",
      id: "regulatory-requirements-team-3",
    },
  },
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
  fit: false,
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
        "background-color": "white",
        "border-color": "black",
        "border-width": "2px",
        width: "60px",
        height: "60px",
        "text-valign": "bottom",
        "text-halign": "center",
        "font-size": 24,
        "background-image": function (ele) {
          const type = ele.data("type");
          // The height and width are decided based on the height and width properties in the svg itself.
          //  Setting those styles here did not seem to work.
          switch (type) {
            case "lightbulb":
              return "url(/assets/imgs/solution_frameworks/lightbulb.svg)";
            case "database":
              return "url(/assets/imgs/solution_frameworks/database.svg)";

            case "question":
              return "url(/assets/imgs/solution_frameworks/question.svg)";

            default:
              return "url(/assets/imgs/solution_frameworks/lightbulb.svg)";
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
        "curve-style": "unbundled-bezier",
        "control-point-step-size": 40,
        "control-point-distances": function (ele) {
          const sourcePos = ele.source().position();
          const targetPos = ele.target().position();
          const dx = targetPos.x - sourcePos.x;
          const dy = targetPos.y - sourcePos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Now we decide the control point distances based on the calculated distance
          // You can adjust the formula to suit your needs
          const controlPointDistance = distance * 0.03;
          return `${(dx < 0 ? -1 : 1) * controlPointDistance}  ${
            (dy < 0 ? -1 : 1) * controlPointDistance
          }`;
        },
        "control-point-weights": "0.2 0.6 0.2",
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
  popperBg.classList.remove("visible");
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
  popperBg.classList.add("visible");
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

  const id = uuid.v4();
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
        id: uuid.v4(),
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

const handleNodeTypeChangeFormSubmit = (e) => {
  e.preventDefault();
  spinnerControl.isShown = true;
  dialogControl.isShown = false;
  const formData = new FormData(e.target); // Get form data
  const dataObject = Object.fromEntries(formData.entries()); // Convert FormData to plain object
  const newType = dataObject.type;
  if (newType) {
    currentSelectedNode.data("type", newType);
  }
  hidePopper();
  setTimeout(() => {
    spinnerControl.isShown = false;
  }, 3000);
};

const handleNodeTypeChange = () => {
  dialog.innerHTML = `<form onsubmit="handleNodeTypeChangeFormSubmit(event)">
  <p>Current Type: ${currentSelectedNode.data("type")}</p>
  Select new type:
  <select name="type">
  <option value="lightbulb">lightbulb</option>
  <option value="question">question</option>
  <option value="database">database</option>
  </select>
  <button>Save</button>
  </form>`;
  dialogControl.isShown = true;
};

const handleEditOptions = (e) => {
  let element = getElementFromEvent(e);
  switch (element.dataset.option) {
    case "rename":
      handleRenameNode();
      hidePopper();
      break;
    case "delete":
      handleDeleteNode();
      hidePopper();
      break;
    case "expand":
      handleExpandNode(currentSelectedNode);
      hidePopper();
      break;
    case "expand-all":
      handleExpandAll();
      hidePopper();
      break;
    case "collapse":
      handleCollapseNode(currentSelectedNode);
      hidePopper();
      break;
    case "collapse-all":
      handleCollapseAll();
      hidePopper();
      break;
    case "change-type":
      handleNodeTypeChange();
      break;
    default:
      console.error(`${element.dataset.option} is not handled`);
  }
};

const handleNodeChange = (e) => {
  console.log({ e });
};
const onAddNode = async (e) => {};
const onRemoveNode = (e) => {
  console.log({ e });
};

/** All event listeners here */
popperBg.addEventListener("click", hidePopper);
addNodesContainer.addEventListener("click", handleAddNode);
nodeOptionsContainer.addEventListener("click", handleEditOptions);

tree.on("click", "node", handleNodeClick);
tree.on("cxttap", "node", handleNodeRightClick);

tree.on("data", "node", handleNodeChange);
tree.on("add", "node", onAddNode);
tree.on("remove", "node", onRemoveNode);

tree.on("mouseover", handleMouseOver);
tree.on("mouseout", handleMouseOut);
