(function (module) {
  module.chosenMineCount = 0;
  
  module.mineRevealerIntervalID = 0;
  module.mineRevealDelay = 100;

  module.createMines = function () {
    // Determine total mine count from grid size and difficulty.
    switch(module.difficultyCurrent) {
      case 'easy':
        module.chosenMineCount = Math.floor(module.gridSize * 0.15);
        break;
      case 'medium':
        module.chosenMineCount = Math.floor(module.gridSize * 0.25);
        break;
      case 'hard':
        module.chosenMineCount = Math.floor(module.gridSize * 0.33);
        break;
    }

    // Select random nodes to receive mines.
    for (let index = 0; index < module.chosenMineCount; ++index) {
      const rand = Math.floor(Math.random() * module.gridArrayEmpty.length);

      // Remove the node from the empty list.
      const node = module.gridArrayEmpty.splice(rand, 1);
      module.gridArrayMined.push(node[0]);
    }
  }
  
  return module;
} (window.MINESWEEPER_MODULE = window.MINESWEEPER_MODULE || {}));