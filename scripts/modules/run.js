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

    // Read settings from local storage.
    module.readSettingsFromLocalStorage();

    // Create the default size grid.
    module.startNewGame();
  }) ();

  return module;
} (window.MINESWEEPER_MODULE = window.MINESWEEPER_MODULE || {}));