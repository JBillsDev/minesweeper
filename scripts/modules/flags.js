(function (module) {
  module.enableFlagPlacement = function(value) {
    const flag = document.getElementById(module.HTMLFlagID);
    // Class used to change cursor style for flag placement.
    const flagCursor = 'flag-cursor';
    // Class used to change text color of Flags to denote flag placement.
    const flagHighlight = 'highlight-text-flag';

    if (value) {
      document.getElementById(module.HTMLGameGridID).classList
        .add(flagCursor);
      flag.classList.add(flagHighlight);
    } else {
      document.getElementById(module.HTMLGameGridID).classList
        .remove(flagCursor);
      flag.classList.remove(flagHighlight);
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
      node.classList.add(module.HTMLNodeFlaggedClass);

      module.checkForWinCondition();
    } else {
      child.innerHTML = '';
      module.flagsPlaced--;
      module.updateFlagsCount();
      node.classList.remove(module.HTMLNodeFlaggedClass);
    }
  }

  module.resetFlags = function() {
    // Update GUI for flag count.
    document.getElementById(module.HTMLFlagCounterID).innerText = module.chosenMineCount;
    // Reset the flags placed counter.
    module.flagsPlaced = 0;
  }

  module.setFlagPlacementCallbacks = function() {
    // Register the control key as the flag-placement active-toggle.
    document.addEventListener('keydown', (e) => {
      if (e.key === module.flagPlacementKey) {
        module.flagPlacementKeyHeld = true;
        module.enableFlagPlacement(true);
      }
    });

    document.addEventListener('keyup', (e) => {
      if (e.key === module.flagPlacementKey) {
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
    document.getElementById(module.HTMLFlagCounterID).innerText =
      module.chosenMineCount - module.flagsPlaced;
  }
  
  return module;
} (window.MINESWEEPER_MODULE = window.MINESWEEPER_MODULE || {}));