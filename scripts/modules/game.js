(function (module) {
  module.startNewGame = function () {
    // Remove the Game Over screen.
    module.revealGameOverScreen(false);

    // Clear any existing interval.
    clearInterval(module.mineRevealerIntervalID);
    clearTimeout(module.gameOverTimeoutID);

    // Clear the existing grid.
    module.clearGrid();
    
    // Determine the current grid dimensions.
    switch(module.gridSizeCurrent) {
      case 'small':
        module.gridWidth = 8;
        break;
      case 'medium':
        module.gridWidth = 10;
        break;
      case 'large':
        module.gridWidth = 14;
        break;
    }
    
    module.gridHeight = Math.floor(module.gridWidth * 1.5);
    module.gridSize = module.gridWidth * module.gridHeight;

    // Create the grid and mines.
    module.createGrid();
    module.createMines();
    module.resetFlags();
  }

  return module;
} (window.MINESWEEPER_MODULE = window.MINESWEEPER_MODULE || {}));