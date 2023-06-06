(function (module) {
  // Timers and Delays
  module.gridArrayEmpty = [];
  module.gridArrayMined = [];

  module.gridWidth = 0;
  module.gridHeight = 0;
  module.gridSize = 0;
  module.gridSizeCurrent = 'medium';
  module.difficultyCurrent = 'medium';

  module.clearGrid = function () {
    // Clear the empty and mined arrays
    module.gridArrayEmpty = [];
    module.gridArrayMined = [];

    // Clear the nodes from the grid
    document.getElementById('game-grid').innerHTML = '';
  }

  module.createGrid = function () {
    // Grab reference to game grid
    const gameGrid = document.getElementById('game-grid');

    // Set the CSS grid dimensions
    gameGrid.style.gridTemplateColumns = `repeat(${module.gridWidth}, 1fr)`;
    gameGrid.style.gridTemplateRows = `repeat(${module.gridHeight}, 1fr)`;

    let index = 0;
    for (let y = 0; y < module.gridHeight; ++y) {
      for (let x = 0; x < module.gridWidth; ++x) {
        // Create the grid node
        const node = document.createElement('div');
        node.id = `grid-node-${index}`;
        node.classList.add('grid-node');

        // Add callback for user click
        /* Passing in the index value would leave all onNodeClick
        callbacks referencing the final index value from this loop.
        Pass in the direct value instead. */
        node.onclick = () => module.onNodeClick(node, (y * module.gridWidth) + x);

        // Create inner element used for styling
        const nodeInner = document.createElement('div');

        // Append nodes
        node.appendChild(nodeInner);
        gameGrid.appendChild(node);

        module.gridArrayEmpty.push(index);
        index++;
      }
    }
  }

  return module;
}(window.MINESWEEPER_MODULE = window.MINESWEEPER_MODULE || {}));