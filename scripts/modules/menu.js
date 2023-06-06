(function (module) {
  module.closeDifficultyMenu = function () {
    document.getElementById('difficulty-btn').classList.remove('active');
    document.getElementById('difficulty-menu').classList.remove('active');
  }

  // Close all menus open in the main hamburger menu.
  module.closeFullMenu = function () {
    module.closeDifficultyMenu();
    module.closeGridSizeMenu();
    module.closeHamburgerMenu();
  }

  module.closeGridSizeMenu = function () {
    document.getElementById('grid-size-btn').classList.remove('active');
    document.getElementById('grid-size-menu').classList.remove('active');
  }

  module.closeHamburgerMenu = function () {
    document.getElementById('minesweeper-menu-btn').classList
      .remove('active');
    document.getElementById('minesweeper-menu').classList
      .remove('active');
  }
  
  module.setDifficultyMenuCallbacks = function () {
    // Set the game difficulty menu active on click.
    document.getElementById('difficulty-btn')
      .addEventListener('click', () => {
      // Make sure grid size menu is not open at the same time.
      module.closeGridSizeMenu();

      const difficultyBtn = document.getElementById('difficulty-btn');
      if (difficultyBtn.classList.contains('active')) {
        module.closeDifficultyMenu();
      } else {
        difficultyBtn.classList.add('active');
        document.getElementById('difficulty-menu').classList.add('active');
      }
    });

    // Set the difficulty buttons click callbacks.
    document.getElementById('difficulty-easy')
      .addEventListener('click', () => {
      module.setDifficulty('easy');
      module.createGrid();
      module.closeFullMenu();
    });

    document.getElementById('difficulty-medium')
      .addEventListener('click', () => {
      module.setDifficulty('medium');
      module.createGrid();
      module.closeFullMenu();
    });

    document.getElementById('difficulty-hard')
      .addEventListener('click', () => {
      module.setDifficulty('hard');
      module.createGrid();
      module.closeFullMenu();
    });
  }

  module.setGridSizeMenuCallbacks = function() {
    // Set the grid size menu active on click.
    document.getElementById('grid-size-btn')
      .addEventListener('click', () => {
      // Make sure difficulty menu is not open at the same time.
      module.closeDifficultyMenu();

      const gridSizeBtn = document.getElementById('grid-size-btn');
      if (gridSizeBtn.classList.contains('active')) {
        module.closeGridSizeMenu();
      } else {
        gridSizeBtn.classList.add('active');
        document.getElementById('grid-size-menu').classList.add('active');
      }
    });

    // Set the grid size buttons click callbacks
    document.getElementById('grid-size-small')
      .addEventListener('click', () => {
      module.setGridSize('small');
      module.createGrid();
      module.closeFullMenu();
    });

    document.getElementById('grid-size-medium')
      .addEventListener('click', () => {
      module.setGridSize('medium');
      module.createGrid();
      module.closeFullMenu();
    });

    document.getElementById('grid-size-large')
      .addEventListener('click', () => {
      module.setGridSize('large');
      module.createGrid();
      module.closeFullMenu();
    });
  }

  module.setMenuCallbacks = function () {
    // Set the menu to active or inactive on click.
    document.getElementById('minesweeper-menu-btn')
      .addEventListener('click', () => {
      const menuBtn = document.getElementById('minesweeper-menu-btn');
      if (menuBtn.classList.contains('active')) {
        module.closeFullMenu();
      } else {
        document.getElementById('minesweeper-menu')
          .classList.add('active');
        menuBtn.classList.add('active');
      }
    });

    /* Set the new game button to create a fresh game with current size
    and difficulty. */
    document.getElementById('new-game-btn')
      .addEventListener('click', () => {
        // Close open menus
        module.closeFullMenu();
        module.startNewGame();
    });
  }

  return module;
} (window.MINESWEEPER_MODULE = window.MINESWEEPER_MODULE || {}));