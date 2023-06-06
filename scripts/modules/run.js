(function (module) {
  // Run the game.
  (() => {
    // Setup the callback functions for static elements.
    module.setDifficultyMenuCallbacks();
    module.setFlagPlacementCallbacks();
    module.setGithubLinkCallbacks();
    module.setGridSizeMenuCallbacks();
    module.setGameOverCallbacks();
    module.setGameWinCallbacks();
    module.setInfoMenuCallbacks();
    module.setMenuCallbacks();

    // Set the default difficulty and grid size.
    module.setDifficulty('medium');
    module.setGridSize('medium');

    // Create the default size grid.
    module.startNewGame();
  }) ();

  return module;
} (window.MINESWEEPER_MODULE = window.MINESWEEPER_MODULE || {}));