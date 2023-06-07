(function (module) {
        // FLAG VARIABLES
  // Current number of flags the player has placed.
  module.flagsPlaced = 0;
  // Whether or not the player is holding the flag placement key down.
  module.flagPlacementEnabled = false;
  /* Used to prevent removing the flag placement mode if user 'clicks
  off' flag placement while the flag placement key is still held down. */
  module.flagPlacementKeyHeld = false;

        // GAMEPLAY VARIABLES
  // Supported game difficulties.
  module.difficultyEasy = 'easy';
  module.difficultyMedium = 'medium';
  module.difficultyHard = 'hard';
  // Supported sizes of game grid.
  module.gridSizeSmall = 'small';
  module.gridSizeMedium = 'medium';
  module.gridSizeLarge = 'large';
  // Game variables used to setup the next game.
  module.difficultyCurrent = module.gridSizeMedium;
  module.gridSizeCurrent = module.difficultyMedium;

        // GRID VARIABLES
  // Arrays to separate the nodes in the game grid.
  module.gridArrayEmpty = [];
  module.gridArrayMined = [];
  // Grid dimensions.
  module.gridWidth = 0;
  module.gridHeight = 0;
  module.gridSize = 0;

        // HTML CLASSES
  // Class used to set the flag icon on a node.
  module.HTMLNodeFlaggedClass = 'flagged';

        // HTML CLASS QUERIES
  // Class used to denote 'no' buttons.
  module.HTMLBtnNoQuery = '.game-btn-no';
  // Class used to denote various 'yes' or 'ok' buttons.
  module.HTMLBtnYesQuery = '.game-btn-yes';

        // HTML IDS
  // ID for the GUI flags remaining value.
  module.HTMLFlagCounterID = 'flag-count';
  // ID for the clickable Flags text that toggles flag placement.
  module.HTMLFlagID = 'flag';
  // ID for the game grid.
  module.HTMLGameGridID = 'game-grid';
  // ID for the Game Over menu.
  module.HTMLGameOverMenuID = 'game-over-menu';
  // ID for the Game Win menu.
  module.HTMLGameWinMenuID = 'game-win-menu';
  // ID for the hamburger button.
  module.HTMLHamburgerButtonID = 'hamburger-btn'
  // ID for the hamburger menu.
  module.HTMLHamburgerMenuID = 'hamburger-menu'
  // IDs for the difficulty buttons.
  module.HTMLDifficultyButtonID = 'difficulty-btn';
  module.HTMLDifficultyEasyID = 'difficulty-easy';
  module.HTMLDifficultyMediumID = 'difficulty-medium';
  module.HTMLDifficultyHardID = 'difficulty-hard';
  // ID for the grid difficulty menu.
  module.HTMLGridDifficultyMenuID = 'difficulty-menu';
  // IDs for the grid size buttons.
  module.HTMLGridSizeButtonID = 'grid-size-btn';
  module.HTMLGridSizeSmallID = 'grid-size-small';
  module.HTMLGridSizeMediumID = 'grid-size-medium';
  module.HTMLGridSizeLargeID = 'grid-size-large';
  // ID for the grid size menu.
  module.HTMLGridSizeMenuID = 'grid-size-menu';
  // ID for the info menu.
  module.HTMLInfoMenuID = 'info-menu';
  // ID for the GUI mines remaining value.
  module.HTMLMineCounterID = 'mine-count';
  // ID for the root of the game.
  module.HTMLMinesweeperID = 'minesweeper';

        // INPUT VARIABLES
  // Key used to toggle flag placement.
  module.flagPlacementKey = 'Control'

        // MINE VARIABLES
  // The number of mines, determined by difficulty and grid size.
  module.chosenMineCount = 0;

        // SETTINGS VARIABLES
  // Key used for local storage
  module.storageKey = 'jbd_minesweeper_settings';
  // Used to ensure we do not create invalid or misordered storage.
  module.storageIndexDifficulty = 0;
  module.storageIndexGridSize = 1;
  module.storageLength = 2;

        // TIMER AND ASYNC VARIABLES
  // Used to end the gameOver timeout early.
  module.gameOverTimeoutID = 0;
  // Used to end the gameOver internal for mine revealing animation.
  module.mineRevealerIntervalID = 0;
  // Milliseconds between the reveal of each mine.
  module.mineRevealDelay = 100;

  return module;
} (window.MINESWEEPER_MODULE = window.MINESWEEPER_MODULE || {}));