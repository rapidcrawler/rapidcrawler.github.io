"use strict";

const getElementFromEvent = (e, maxDepth = 1) => {
  let element = e.target;
  if (e.target.classList.contains("fa")) {
    element = e.target.parentElement;
  }
  return element;
};

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

const errorMessageContainer = document.querySelector("#error-msg-container");
const errorMessageControl = new Proxy(
  { message: "" },
  {
    set(target, prop, value) {
      errorMessageContainer.innerText = value;
      target[prop] = value;
      return true;
    },
  }
);

const dialogContainer = document.querySelector("#dialog-container");
const actionContainers = document.querySelectorAll(".actions-container");
const dialogBg = document.querySelector("#dialog-container .dialog-bg");
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
const baseURL = "https://rapidcrawler-aniganesh.koyeb.app/";
const POPPER_WIDTH = 300;
const POPPER_HEIGHT = 450;
const popperBg = document.querySelector("#popper-bg");
const popper = document.querySelector("#popper");
const addNodesContainer = document.querySelector("#add-nodes");
const nodeOptionsContainer = document.querySelector("#node-options-container");
const nodeContainer = document.querySelector("#nodes");
const authCodeInput = document.querySelector("input[name=auth-code]");

const COMMON_HEADERS = { "content-type": "application/json" };
/**
 * Make a request to the back-end
 * @param {ReqObject} param0 Request object
 * @returns {Promise}
 */
const request = async ({ method, url, data, token }) => {
  try {
    const _baseURL =
      baseURL[baseURL.length - 1] === "/" ? baseURL.slice(0, -1) : baseURL;
    const _url = url[0] === "/" ? url : "/" + url;

    spinnerControl.isShown = true;
    const res = await fetch(`${_baseURL}${_url}`, {
      method,
      body: data ? JSON.stringify(data) : undefined,
      headers: {
        ...COMMON_HEADERS,
        ...(token ? { authorization: token } : {}),
      },
    });
    if (res.status >= 400) {
      const json = await res.json();
      throw {
        status: res.status,
        message: json.message ?? res.message ?? res.statusText,
      };
    }
    if (res.headers.get("content-length") !== "0") {
      if (token) {
        errorMessageControl.message = "";
      }
      return res.json();
    }
  } catch (err) {
    console.error(err);
    errorMessageControl.message = "Auth code not supplied or invalid";
  } finally {
    spinnerControl.isShown = false;
  }
};

nodeContainer.style.height = `${
  parent.window.innerHeight
    ? parent.window.innerHeight - 40
    : window.innerHeight
}px`;

const initialNodes = await request({
  method: "get",
  url: "/nodes",
});

const initialEdges = await request({
  method: "get",
  url: "/edges",
});

const allEdges = [...initialEdges];
const allNodes = [...initialNodes];

const layoutOptions = {
  name: "dagre",
  directed: true,
  padding: 20,
  spacingFactor: 2,

  avoidOverlap: true,
  nodeDimensionsIncludeLabels: false,
  root: "root-node",
  rankDir: "TB",
  transform: function (node, position) {
    return position;
  },
};
const tree = cytoscape({
  container: nodeContainer,
  layout: layoutOptions,
  userZoomingEnabled: false,
  elements: [...initialNodes, ...initialEdges], // list of graph elements to start with
  style: [
    {
      selector: "node",
      style: {
        label: function (ele) {
          const id = ele.data("id");
          const isChildrenHidden = childrenHiddenNodes.includes(id);
          const hasChildren = allEdges.find(
            ({ data: { source } }) => source === id
          );
          let suffix = "";
          if (hasChildren) {
            suffix = isChildrenHidden ? "(+)" : "(-)";
          }
          return ele.data("label") + suffix;
        },
        "background-color": function (ele) {
          const type = ele.data("type");
          switch (type) {
            case "assumption":
              return "#820300";
            case "datapoints":
              return "#0D4C92";

            case "questions":
              return "#0D9276";

            default:
              return "#820300";
          }
        },
        "border-color": "transparent",
        "border-width": "0px",
        // node size
        width: "60px",
        height: "60px",
        // Align text vertically to the bottom and horizontally centered.
        "text-valign": "bottom",
        "text-halign": "center",
        "font-size": 24,
        "background-image": function (ele) {
          const type = ele.data("type");
          // The height and width are decided based on the height and width properties in the svg itself.
          //  Setting those styles here did not seem to work.
          switch (type) {
            case "assumption":
              return "url(/assets/imgs/solution_frameworks/lightbulb.svg)";
            case "datapoints":
              return "url(/assets/imgs/solution_frameworks/database.svg)";

            case "questions":
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
        // Styles for "edge" or connecting lines are applied here.
        width: 3,
        "line-color": "#ccc",
        "target-arrow-color": "#ccc",
        "target-arrow-shape": "triangle",
        "text-margin-y": -15,
        "edge-distances": "node-position",
      },
    },
  ],
});

const root = tree.elements().filter((node) => node.indegree() === 0);

const nodesToHideIds = initialEdges
  .filter(({ data: { source } }) => source !== root.data("id"))
  .map(({ data: { target } }) => target);

for (const id of nodesToHideIds) {
  const selector = `node[id="${id}"]`;
  const selectedNodes = tree.elements(selector);
  selectedNodes.hide();
}

childrenHiddenNodes.splice(
  -1,
  0,
  ...initialEdges
    .filter(({ data: { source } }) => source === root.data("id"))
    .map(({ data: { target } }) => target),
  ...nodesToHideIds
);

setTimeout(() => tree.layout(layoutOptions).run());
tree.nodes().forEach(function (node) {
  node.data("label", node.data("label") + " ");
  node.trigger("data");
});

const handleZoom = (zoomAmount) => {
  if (zoomAmount === 0) {
    tree.layout(layoutOptions).run();
  } else {
    tree.zoom(tree.zoom() + zoomAmount);
  }
};

const handleImageSaveFormSubmit = async (e) => {
  e.preventDefault();
  dialogControl.isShown = false;
  const formData = new FormData(e.target); // Get form data
  const dataObject = Object.fromEntries(formData.entries()); // Convert FormData to plain object
  const imageOptions = { bg: "transparent", highQuality: true };
  if (!dataObject.transparent) {
    imageOptions.bg = dataObject.color;
  }
  const pngString = await tree.png(imageOptions);
  const downloadLink = document.createElement("a");
  downloadLink.href = pngString;
  downloadLink.download = `First_Principles_${new Date()
    .toLocaleDateString()
    .replace(/\//g, "-")}.png`;
  downloadLink.innerText = "Download image";
  document.body.appendChild(downloadLink);

  downloadLink.click();

  document.body.removeChild(downloadLink);
};

const handleSaveAsImage = () => {
  dialog.innerHTML = `<form>
  <p style="margin:0; padding:0 0 10px 0; font-size: 24px; text-align: center;">Image export options</p>
  <label>Select background for your image 
  <input type="color" name="color" value="#ffffff" />
  </label>
  <label>
  <input type="checkbox" name="transparent" /> Ignore above colour and make the background transparent
  </label>
  <button>Save as image</button>
  </form>`;
  dialog
    .querySelector("form")
    .addEventListener("submit", handleImageSaveFormSubmit);
  dialogControl.isShown = true;
};

const handleGraphActions = (e) => {
  const element = getElementFromEvent(e);
  const action = element.dataset.action;
  switch (action) {
    case "zoom-in":
      handleZoom(0.05);
      break;
    case "zoom-out":
      handleZoom(-0.05);
      break;
    case "fit":
      handleZoom(0);
      break;
    case "save-as-image":
      handleSaveAsImage();
      break;
  }
};

function getAllConnectedNodes(node) {
  let connectedNodes = [];
  const uniqueIds = [];

  const successors = node.successors();
  successors.forEach((node) => {
    if (!uniqueIds.includes(node.data("id"))) {
      connectedNodes.push(node);
      uniqueIds.push(node.data("id"));
    }
  });

  return connectedNodes;
}

const handleExpandNode = (node, fullDepth = false) => {
  let connectedNodes = [];
  if (fullDepth) {
    connectedNodes = getAllConnectedNodes(node, fullDepth ? -1 : 0);
  } else {
    const neighborhood = node.neighborhood();
    connectedNodes = neighborhood.map((node) => node);
  }

  connectedNodes.forEach((node) => {
    node.show();
  });
  tree.layout(layoutOptions).run();
};

const handleCollapseNode = (node) => {
  const connectedNodes = getAllConnectedNodes(node);
  connectedNodes.forEach((node) => {
    node.hide();
  });

  childrenHiddenNodes.splice(
    -1,
    0,
    ...connectedNodes.map((node) => node.data("id"))
  );

  tree.layout(layoutOptions).run();
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
  window.addEventListener("keydown", enableZoomOnCtrlKeyDown);
  window.addEventListener("keyup", disableZoomOnCtrlKeyup);
};
const handleMouseOut = () => {
  window.removeEventListener("keydown", enableZoomOnCtrlKeyDown);
  window.removeEventListener("keyup", disableZoomOnCtrlKeyup);
};

let currentSelectedNode = null;
const handleNodeRightClick = (e) => {
  e.preventDefault();
  e.stopPropagation();
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

const hideDialog = () => {
  dialogControl.isShown = false;
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
    "Are you sure you want to delete this node? All child nodes connected to this will also be deleted!"
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
  handleExpandNode(root, true);
  hidePopper();
};

const handleNodeTypeChangeFormSubmit = async (e) => {
  e.preventDefault();
  dialogControl.isShown = false;
  const formData = new FormData(e.target); // Get form data
  const dataObject = Object.fromEntries(formData.entries()); // Convert FormData to plain object
  const newType = dataObject.type;
  if (newType) {
    currentSelectedNode.data("type", newType);
  }
  hidePopper();
};

const handleNodeTypeChange = () => {
  dialog.innerHTML = `<form>
  <label>Select new type for <span style="color: #005d25"> ${currentSelectedNode.data(
    "label"
  )}</span>:</label>
  <select name="type">
  ${[
    { label: "Assumption", value: "assumption" },
    { label: "Question", value: "questions" },
    { label: "Datapoint", value: "datapoints" },
  ].map(
    ({ label, value: val }) =>
      `<option value="${val}" ${
        currentSelectedNode.data("type") === val ? 'selected=""' : ""
      }>${label}</option>`
  )}
  </select>
  <button>Save</button>
  </form>`;
  dialog
    .querySelector("form")
    .addEventListener("submit", handleNodeTypeChangeFormSubmit);
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
      handleExpandNode(currentSelectedNode, false);
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

const handleNodeChange = async (e) => {
  const data = e.target.data();
  const { id, ...rest } = data;

  await request({
    method: "put",
    url: `/nodes/${id}`,
    data: {
      node: {
        ...rest,
      },
    },
    token: authCodeInput.value,
  });
};

const onAddNode = async (e) => {
  const data = e.target.data();
  allNodes.push({ data });
  await request({
    method: "post",
    url: `/nodes/`,
    data: {
      node: {
        data,
      },
    },
    token: authCodeInput.value,
  });
};

const onAddEdge = async (e) => {
  const data = e.target.data();
  allEdges.push({ data });
  await request({
    method: "post",
    url: `/edges/`,
    data: {
      edge: {
        data,
      },
    },
    token: authCodeInput.value,
  });
};
const deleteEdgeInDB = (id) => {
  return request({
    method: "delete",
    url: `/edges/${id}`,
    token: authCodeInput.value,
  });
};
const deleteNodeInDB = (id) => {
  return request({
    method: "delete",
    url: `/nodes/${id}`,
    token: authCodeInput.value,
  });
};

const onRemoveNode = async (e) => {
  const data = e.target.data();
  deleteNodeInDB(data.id);
  const edgesToDeleteIds = allEdges
    .filter(function (edge) {
      return edge.data.target === data.id || edge.data.source === data.id;
    })
    .map(({ data: { id } }) => id);

  const directlyConnectedNodeIds = allEdges
    .filter(function (edge) {
      return edge.data.source === data.id;
    })
    .map(({ data: { target } }) => target);

  let nodesToDelete = directlyConnectedNodeIds
    .map((id) => tree.$id(id))
    .concat(
      directlyConnectedNodeIds.flatMap((id) =>
        getAllConnectedNodes(tree.$id(id))
      )
    );

  nodesToDelete = nodesToDelete.reduce((arr, curr, index) => {
    if (nodesToDelete.indexOf(curr) === index) {
      arr.push(curr);
    }
    return arr;
  }, []);

  nodesToDelete.forEach((node) => node.remove());
  edgesToDeleteIds.forEach(deleteEdgeInDB);

  allEdges.forEach((item, index) => {
    if (edgesToDeleteIds.includes(item.data.id)) {
      allEdges.splice(index, 1);
    }
  });
};

const onRemoveEdge = async (e) => {
  const data = e.target.data();
  deleteEdgeInDB(data.id);
};

const stopEvent = (e) => {
  e.preventDefault();
};

/** All event listeners here */
popperBg.addEventListener("click", hidePopper);
dialogBg.addEventListener("click", hideDialog);
addNodesContainer.addEventListener("click", handleAddNode);
nodeOptionsContainer.addEventListener("click", handleEditOptions);

nodeContainer.addEventListener("mouseout", () => {
  document.removeEventListener("contextmenu", stopEvent);
});
nodeContainer.addEventListener("mouseover", () => {
  document.addEventListener("contextmenu", stopEvent);
});

actionContainers.forEach((container) => {
  container.addEventListener("click", handleGraphActions);
});

tree.on("click", "node", handleNodeClick);
tree.on("cxttap", "node", handleNodeRightClick);

tree.on("data", "node", handleNodeChange);
tree.on("add", "node", onAddNode);
tree.on("add", "edge", onAddEdge);
tree.on("remove", "node", onRemoveNode);

tree.on("mouseover", handleMouseOver);
tree.on("mouseout", handleMouseOut);
