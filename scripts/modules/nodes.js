(function (module) {
  // Search an array of neighboring nodes for total number of mines.
  module.getNeighboringMinesCount = function (neighborArray) {
    let neighboringMines = 0;
    for (let count = 0; count < neighborArray.length; count++) {
      if (module.gridArrayMined.indexOf(neighborArray[count]) != -1) {
        neighboringMines++;
      }
    }

    return neighboringMines;
  }

  module.getNeighborNodes = function (index) {
    const neighborArray = [];

    // Determine if the current node exists against a border.
    if (index === 0) {
      // Node is in the top-left corner.
      neighborArray.push(
        index + 1,              // right
        index + module.gridWidth,      // bottom
        index + module.gridWidth + 1); // bottom-right
    } else if (index < module.gridWidth - 1) {
      // Node is against the top border, not in a corner.
      neighborArray.push(
        index - 1,              // left
        index + 1,              // right
        index + module.gridWidth - 1,  // bottom-left
        index + module.gridWidth,      // bottom
        index + module.gridWidth + 1); // bottom-right
    } else if (index === module.gridWidth - 1) {
      // Node is in the top-right corner.
      neighborArray.push(
        index - 1,            // left
      index + module.gridWidth - 1,  // bottom-left
      index + module.gridWidth);     // bottom
    } else if (index === module.gridSize - module.gridWidth) {
      // Node is in the bottom-left corner.
      neighborArray.push(
        index - module.gridWidth,      // top
        index - module.gridWidth + 1,  // top-right
        index + 1);             // right
    } else if (index === module.gridSize - 1) {
      // Node is in the bottom-right corner.
      neighborArray.push(
        index - module.gridWidth - 1,  // top-left
        index - module.gridWidth,      // top
        index - 1);             // left
    } else if (index % module.gridWidth === 0) {
      // Node is on the left border.
      neighborArray.push(
        index - module.gridWidth,     // top
        index - module.gridWidth + 1,  // top-right
        index + 1,              // right
        index + module.gridWidth,      // bottom
        index + module.gridWidth + 1); // bottom-right
    } else if (index % module.gridWidth === module.gridWidth - 1) {
      // Node is on the right border.
      neighborArray.push(
        index - module.gridWidth - 1,  // top-left
        index - module.gridWidth,      // top
        index - 1,              // left
        index + module.gridWidth - 1,  // bottom-left
        index + module.gridWidth);     // bottom
    } else if (index >= module.gridSize - module.gridWidth) {
      // Node is against the bottom border, not in a corner.
      neighborArray.push(
        index - module.gridWidth - 1,  // top-left
        index - module.gridWidth,      // top
        index - module.gridWidth + 1,  // top-right
        index - 1,              // left
        index + 1);             // right
    } else {
      // Node is not against any border
      neighborArray.push(
        index - module.gridWidth - 1,  // top-left
        index - module.gridWidth,      // top
        index - module.gridWidth + 1,  // top-right
        index - 1,              // left
        index + 1,              // right
        index + module.gridWidth - 1,  // bottom-left
        index + module.gridWidth,      // bottom
        index + module.gridWidth + 1); // bottom-right
    }

    return neighborArray;
  }

  // Callback function for grid nodes being clicked.
  module.onNodeClick = function (node, index) {
    // Place or remove flag if flag placement is enabled.
    if (module.flagPlacementEnabled) {
      if (node.classList.contains('flagged')) {
        module.placeFlag(node, false);
      } else {
        module.placeFlag(node, true);
      }

      return;
    }
    
    /* If flag placement is not enabled, but a flag exists,
    remove the flag instead of revealing the node. */
    if (node.classList.contains('flagged')) {
      module.placeFlag(node, false);

      return;
    }

    const mineIndex = module.gridArrayMined.indexOf(index);
    // If a mine was uncovered, game over.
    if (mineIndex != -1) {
      /* Place the mined node the player clicked on at the front
      of the mined nodes array. */
      module.gridArrayMined.unshift(module.gridArrayMined.splice(mineIndex, 1)[0]);

      module.setGameOverState();

      return;
    }

    // Search valid nodes
    module.searchForNearbyMines(index);
    // Check if all non-mined tiles have been revealed.
    module.checkForWinCondition();
  }

  module.removeNodeInteractions = function () {
    document.getElementById('game-grid').querySelectorAll('.grid-node')
      .forEach(node => {
      // Prevent the nodes from animating when hovered over.
      node.querySelector('div').classList.add('frozen');

      // Remove the onclick callback.
      node.onclick = 0;
    });
  }

  module.searchForNearbyMines = function (index) {
    const checkedNodes = [];
    const uncheckedNodes = [index];

    // Prevent getting stuck in loop if logic fails.
    let iteration = 0;
    const maxIterations = 1000;
    while (uncheckedNodes.length > 0 && iteration < 1000) {
      // Get valid, neighboring nodes
      const neighborArray = module.getNeighborNodes(uncheckedNodes[0]);

      // Determine how many neighbors contain mines.
      let neighboringMines = module.getNeighboringMinesCount(neighborArray);

      // Grab a reference to the current node.
      const currentNode = document
        .getElementById(`grid-node-${uncheckedNodes[0]}`);
      // Set the node to 'clicked'.
      currentNode.classList.add('clicked');
      // Remove the node's onclick function.
      currentNode.onclick = 0;

      /* If node has any neighboring mines, display the number of
      neighboring mines, and do not add neighbors to uncheckedNodes.
      Otherwise, show an empty tile as clicked. */
      if (neighboringMines != 0) {
        currentNode.querySelector('div').textContent = neighboringMines;
        
        // Return if the is the original node clicked.
        if (index == uncheckedNodes[0]) {
          return;
        }
      } else {
        /* If node does not have any mines for neighbors, check all of
        its neighboring nodes, making sure not to add a node that has
        already been clicked, evaluated, or marked for evaluation, to
        either list. */
        for (let i = 0; i < neighborArray.length; ++i) {
          const value = neighborArray[i];
          if (!document.getElementById(`grid-node-${value}`).classList
            .contains('clicked')
            && (checkedNodes.indexOf(value) === -1)
            && (uncheckedNodes.indexOf(value) === -1)) {
              uncheckedNodes.push(value);
          }
        }
      }

      // Move the current node to the checked list.
      checkedNodes.push(uncheckedNodes.shift());

      iteration++;
    }
  }

  return module;
} (window.MINESWEEPER_MODULE = window.MINESWEEPER_MODULE || {}));