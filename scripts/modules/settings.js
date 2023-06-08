(function (module) {
  module.readSettingsFromLocalStorage = function() {
    // Retrieve settings from local storage and convert from JSON string.
    let settings = JSON.parse(localStorage.getItem(module.storageKey));
    
    // Return if no stored settings were found.
    if (settings === null || settings.length != module.storageLength) {
      module.setDifficulty(module.difficultyMedium);
      module.setGridSize(module.gridSizeMedium);
      
      return;
    }

    module.setDifficulty(settings[module.storageIndexDifficulty]);
    module.setGridSize(settings[module.storageIndexGridSize]);
  }

  module.setDifficulty = function (difficultyString) {
    module.difficultyCurrent = difficultyString;

    // Get difficulty button elements.
    const difficultyEasyBtn = document
      .getElementById(module.HTMLDifficultyEasyID);
    const difficultyMediumBtn = document
      .getElementById(module.HTMLDifficultyMediumID);
    const difficultyHardBtn = document
      .getElementById(module.HTMLDifficultyHardID);
    
    // Remove the existing check mark.
    difficultyEasyBtn.querySelector('i').classList.remove('fa-solid', 'fa-check');
    difficultyMediumBtn.querySelector('i').classList.remove('fa-solid', 'fa-check');
    difficultyHardBtn.querySelector('i').classList.remove('fa-solid', 'fa-check');

    // Add the check mark to the newly selected difficulty.
    switch(module.difficultyCurrent) {
      case module.difficultyEasy:
        difficultyEasyBtn.querySelector('i').classList.add('fa-solid', 'fa-check');
        break;
      case module.difficultyMedium:
        difficultyMediumBtn.querySelector('i').classList.add('fa-solid', 'fa-check');
        break;
      case module.difficultyHard:
        difficultyHardBtn.querySelector('i').classList.add('fa-solid', 'fa-check');
        break;
    }

    module.updateSettingsToStorage();
  }

  module.setGridSize = function (gridSizeString) {
    module.gridSizeCurrent = gridSizeString;

    // Get grid size button elements.
    const gridSizeSmallBtn = document
      .getElementById(module.HTMLGridSizeSmallID);
    const gridSizeMediumBtn = document
      .getElementById(module.HTMLGridSizeMediumID);
    const gridSizeLargeBtn = document
      .getElementById(module.HTMLGridSizeLargeID);

    // Remove the existing check mark.
    gridSizeSmallBtn.querySelector('i').classList.remove('fa-solid', 'fa-check');
    gridSizeMediumBtn.querySelector('i').classList.remove('fa-solid', 'fa-check');
    gridSizeLargeBtn.querySelector('i').classList.remove('fa-solid', 'fa-check');

    // Grab reference to game grid
    const gameGrid = document.getElementById(module.HTMLGameGridID);

    /* Add the check mark to the newly selected grid size, and update the
    relevant grid display properties to adapt to the new node size. */
    switch(module.gridSizeCurrent) {
      case module.gridSizeSmall:
        gridSizeSmallBtn.querySelector('i').classList.add('fa-solid', 'fa-check');
        gameGrid.style.setProperty('font-size', '2rem');
        gameGrid.style.setProperty('padding-top', '5px');
        break;
      case module.gridSizeMedium:
        gridSizeMediumBtn.querySelector('i').classList.add('fa-solid', 'fa-check');
        gameGrid.style.setProperty('font-size', '1.2rem');
        gameGrid.style.setProperty('padding-top', '3px');
        break;
      case module.gridSizeLarge:
        gridSizeLargeBtn.querySelector('i').classList.add('fa-solid', 'fa-check');
        gameGrid.style.setProperty('font-size', '0.8rem');
        gameGrid.style.setProperty('padding-top', '-3px');
        break;
    }

    module.updateSettingsToStorage();
  }

  module.updateSettingsToStorage = function() {
    // Convert from JSON string.
    let settings = JSON.parse(localStorage.getItem(module.storageKey));

    /* If no stored settings were found, or the settings might be
    invalid due to an incorrect array size, create a new array. */
    if (settings === null || settings.length != module.storageLength) {
      settings = [];
      // Set array to the correct size to store the settings.
      settings.length = module.storageLength;
    }

    // Ensure settings are always saved in the correct order.
    settings[module.storageIndexDifficulty] = module.difficultyCurrent;
    settings[module.storageIndexGridSize] = module.gridSizeCurrent;

    // Convert to JSON string and save in local storage.
    localStorage.setItem(module.storageKey, JSON.stringify(settings));
  }

  return module;
} (window.MINESWEEPER_MODULE = window.MINESWEEPER_MODULE || {}));