(function (module) {
  module.setDifficulty = function (difficultyString) {
    module.difficultyCurrent = difficultyString;

    // Get difficulty button elements.
    const difficultyEasyBtn = document.getElementById('difficulty-easy');
    const difficultyMediumBtn = document.getElementById('difficulty-medium');
    const difficultyHardBtn = document.getElementById('difficulty-hard');
    
    // Remove the existing check mark.
    difficultyEasyBtn.querySelector('i').classList.remove('fa-solid', 'fa-check');
    difficultyMediumBtn.querySelector('i').classList.remove('fa-solid', 'fa-check');
    difficultyHardBtn.querySelector('i').classList.remove('fa-solid', 'fa-check');

    // Add the check mark to the newly selected difficulty.
    switch(module.difficultyCurrent) {
      case 'easy':
        difficultyEasyBtn.querySelector('i').classList.add('fa-solid', 'fa-check');
        break;
      case 'medium':
        difficultyMediumBtn.querySelector('i').classList.add('fa-solid', 'fa-check');
        break;
      case 'hard':
        difficultyHardBtn.querySelector('i').classList.add('fa-solid', 'fa-check');
        break;
    }
  }

  module.setGridSize = function (gridSizeString) {
    module.gridSizeCurrent = gridSizeString;

    // Get grid size button elements.
    const gridSizeSmallBtn = document.getElementById('grid-size-small');
    const gridSizeMediumBtn = document.getElementById('grid-size-medium');
    const gridSizeLargeBtn = document.getElementById('grid-size-large');

    // Remove the existing check mark.
    gridSizeSmallBtn.querySelector('i').classList.remove('fa-solid', 'fa-check');
    gridSizeMediumBtn.querySelector('i').classList.remove('fa-solid', 'fa-check');
    gridSizeLargeBtn.querySelector('i').classList.remove('fa-solid', 'fa-check');

    // Grab reference to game grid
    const gameGrid = document.getElementById('game-grid');

    /* Add the check mark to the newly selected grid size, and update the
    relevant grid display properties to adapt to the new node size. */
    switch(module.gridSizeCurrent) {
      case 'small':
        gridSizeSmallBtn.querySelector('i').classList.add('fa-solid', 'fa-check');
        gameGrid.style.setProperty('font-size', '2rem');
        gameGrid.style.setProperty('padding-top', '5px');
        break;
      case 'medium':
        gridSizeMediumBtn.querySelector('i').classList.add('fa-solid', 'fa-check');
        gameGrid.style.setProperty('font-size', '1.2rem');
        gameGrid.style.setProperty('padding-top', '3px');
        break;
      case 'large':
        gridSizeLargeBtn.querySelector('i').classList.add('fa-solid', 'fa-check');
        gameGrid.style.setProperty('font-size', '0.8rem');
        gameGrid.style.setProperty('padding-top', '-3px');
        break;
    }
  }

  return module;
} (window.MINESWEEPER_MODULE = window.MINESWEEPER_MODULE || {}));