(function (module) {
  module.closeDifficultyMenu = function () {
    document.getElementById(module.HTMLDifficultyButtonID).classList.remove('active');
    document.getElementById(module.HTMLGridDifficultyMenuID).classList.remove('active');
  }

  // Close all menus open in the main hamburger menu.
  module.closeFullMenu = function () {
    module.closeDifficultyMenu();
    module.closeGridSizeMenu();
    module.closeHamburgerMenu();
  }

  module.closeGridSizeMenu = function () {
    document.getElementById(module.HTMLGridSizeButtonID).classList.remove('active');
    document.getElementById(module.HTMLGridSizeMenuID).classList.remove('active');
  }

  module.closeHamburgerMenu = function () {
    document.getElementById('minesweeper-menu-btn').classList
      .remove('active');
    document.getElementById('minesweeper-menu').classList
      .remove('active');
  }

  module.displayInfo = function () {
    document.getElementById(module.HTMLInfoMenuID).style.setProperty('display', 'flex');
  }
  
  module.setDifficultyMenuCallbacks = function () {
    // Set the game difficulty menu active on click.
    document.getElementById(module.HTMLDifficultyButtonID)
      .addEventListener('click', () => {
      // Make sure grid size menu is not open at the same time.
      module.closeGridSizeMenu();

      const difficultyBtn = document.getElementById(module.HTMLDifficultyButtonID);
      if (difficultyBtn.classList.contains('active')) {
        module.closeDifficultyMenu();
      } else {
        difficultyBtn.classList.add('active');
        document.getElementById(module.HTMLGridDifficultyMenuID).classList.add('active');
      }
    });

    // Set the difficulty buttons click callbacks.
    document.getElementById(module.HTMLDifficultyEasyID)
      .addEventListener('click', () => {
      module.setDifficulty(module.difficultyEasy);
      module.startNewGame();
      module.closeFullMenu();
    });

    document.getElementById(module.HTMLDifficultyMediumID)
      .addEventListener('click', () => {
      module.setDifficulty(module.difficultyMedium);
      module.startNewGame();
      module.closeFullMenu();
    });

    document.getElementById(module.HTMLDifficultyHardID)
      .addEventListener('click', () => {
      module.setDifficulty(module.difficultyHard);
      module.startNewGame();
      module.closeFullMenu();
    });
  }

  module.setGridSizeMenuCallbacks = function() {
    // Set the grid size menu active on click.
    document.getElementById(module.HTMLGridSizeButtonID)
      .addEventListener('click', () => {
      // Make sure difficulty menu is not open at the same time.
      module.closeDifficultyMenu();

      const gridSizeBtn = document.getElementById(module.HTMLGridSizeButtonID);
      if (gridSizeBtn.classList.contains('active')) {
        module.closeGridSizeMenu();
      } else {
        gridSizeBtn.classList.add('active');
        document.getElementById(module.HTMLGridSizeMenuID).classList.add('active');
      }
    });

    // Set the grid size buttons click callbacks
    document.getElementById(module.HTMLGridSizeSmallID)
      .addEventListener('click', () => {
      module.setGridSize(module.gridSizeSmall);
      module.startNewGame();
      module.closeFullMenu();
    });

    document.getElementById(module.HTMLGridSizeMediumID)
      .addEventListener('click', () => {
      module.setGridSize(module.gridSizeMedium);
      module.startNewGame();
      module.closeFullMenu();
    });

    document.getElementById(module.HTMLGridSizeLargeID)
      .addEventListener('click', () => {
      module.setGridSize(module.gridSizeLarge);
      module.startNewGame();
      module.closeFullMenu();
    });
  }

  module.setInfoMenuCallbacks = function() {
    document.getElementById('info-btn-ok')
      .addEventListener('click', () => {
        document.getElementById(module.HTMLInfoMenuID).style
          .setProperty('display', 'none');
      });
  }

  module.setMenuCallbacks = function () {
    // Set the menu to active or inactive on click.
    document.getElementById(module.HTMLHamburgerButtonID)
      .addEventListener('click', () => {
      const menuBtn = document.getElementById(module.HTMLHamburgerButtonID);
      if (menuBtn.classList.contains('active')) {
        module.closeFullMenu();
      } else {
        document.getElementById(module.HTMLHamburgerMenuID)
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
    
    document.getElementById('info-btn')
      .addEventListener('click', () => {
      module.closeFullMenu();
      module.closeGameEndMenus();
      module.displayInfo();
    });
  }

  return module;
} (window.MINESWEEPER_MODULE = window.MINESWEEPER_MODULE || {}));