(function (module) {
  // Current number of flags the player has placed.
  module.flagsPlaced = 0;
  // Whether or not the player is holding the flag placement key down.
  module.flagPlacementEnabled = false;

  module.placeFlag = function() {
    const child = node.querySelector('div');

    /* If flag placement is currently enabled, spend a flag
    to mark the node, and remove 1 from the GUI flag counter.
    Else, remove the flag marg, and return 1 flag. */
    if (child.innerHTML === "") {
      // If no flags remaining, return.
      if (module.chosenMineCount - module.flagsPlaced <= 0) {
        return;
      }

      child.innerHTML = `<i class="fa-regular fa-flag"></i>`
      module.flagsPlaced++;
      module.updateFlagsCount();
    } else {
      child.innerHTML = '';
      module.flagsPlaced--;
      module.updateFlagsCount();
    }

    return;
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
        flagPlacementEnabled = true;
      }
    });

    document.addEventListener('keyup', (e) => {
      if (e.key === "Control") {
        flagPlacementEnabled = false;
      }
    });
  }

  module.updateFlagsCount = function () {
    document.getElementById('flag-count').innerText = chosenMineCount - flagsPlaced;
  }
  
  return module;
} (window.MINESWEEPER_MODULE = window.MINESWEEPER_MODULE || {}));