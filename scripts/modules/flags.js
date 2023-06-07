(function (module) {
  // Current number of flags the player has placed.
  module.flagsPlaced = 0;
  // Whether or not the player is holding the flag placement key down.
  module.flagPlacementEnabled = false;
  /* Used to prevent removing the flag placement mode if user 'clicks
  off' flag placement while the flag placement key is still held down. */
  module.flagPlacementKeyHeld = false;

  module.enableFlagPlacement = function(value) {
    const flag = document.getElementById('flag');

    if (value) {
      document.getElementById('game-grid').classList.add('flag-cursor');
      flag.classList.add('highlight-text-flag');
    } else {
      document.getElementById('game-grid').classList.remove('flag-cursor');
      flag.classList.remove('highlight-text-flag');
    }

    module.flagPlacementEnabled = value;
  }

  module.placeFlag = function(node, value) {
    const child = node.querySelector('div');

    /* If flag placement is currently enabled, spend a flag
    to mark the node, and remove 1 from the GUI flag counter.
    Else, remove the flag marg, and return 1 flag. */
    if (value) {
      // If no flags remaining, return.
      if (module.chosenMineCount - module.flagsPlaced <= 0) {
        return;
      }

      child.innerHTML = `<i class="fa-regular fa-flag"></i>`;
      module.flagsPlaced++;
      module.updateFlagsCount();
      node.classList.add('flagged');

      module.checkForWinCondition();
    } else {
      child.innerHTML = '';
      module.flagsPlaced--;
      module.updateFlagsCount();
      node.classList.remove('flagged');
    }
  }

  module.resetFlags = function() {
    // Update GUI for mine and flag count.
    document.getElementById('mine-count').innerText = module.chosenMineCount;
    document.getElementById('flag-count').innerText = module.chosenMineCount;
    // Reset the flags placed counter.
    module.flagsPlaced = 0;
  }

  module.setFlagPlacementCallbacks = function() {
    // Register the control key as the flag-placement active-toggle.
    document.addEventListener('keydown', (e) => {
      if (e.key === "Control") {
        module.flagPlacementKeyHeld = true;
        module.enableFlagPlacement(true);
      }
    });

    document.addEventListener('keyup', (e) => {
      if (e.key === "Control") {
        module.flagPlacementKeyHeld = false;
        module.enableFlagPlacement(false);
      }
    });

    document.getElementById('flag')
      .addEventListener('click', () => {
      // Toggle flag placement from current active state.
      if (module.flagPlacementEnabled
          && !module.flagPlacementKeyHeld) {
        module.enableFlagPlacement(false);
      } else {
        module.enableFlagPlacement(true);
      }
    });
  }

  module.updateFlagsCount = function () {
    document.getElementById('flag-count').innerText =
      module.chosenMineCount - module.flagsPlaced;
  }
  
  return module;
} (window.MINESWEEPER_MODULE = window.MINESWEEPER_MODULE || {}));