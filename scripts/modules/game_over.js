(function (module) {
  module.gameOverTimeoutID = 0;

  module.setGameOverCallbacks = function () {
    // Set the Game Over menu buttons click callbacks.
    document.getElementById('game-over-yes').addEventListener('click', () => {
      module.createGrid();
      document.getElementById('game-over-menu').style
        .setProperty('display', 'none');
    });

    document.getElementById('game-over-no').addEventListener('click', () => {
      document.getElementById('game-over-menu').style
        .setProperty('display', 'none');
    });
  }

  module.setGameOverState = function () {
    const minesweeper = document.getElementById('minesweeper');
  
    // Trigger the red flash of the mine blowing up.
    minesweeper.classList.add('game-over');
    // Set the timer for the red flash class to be removed.
    setTimeout(() => {
      minesweeper.classList.remove('game-over');
    }, 500);
  
    // Create the mine icon to place within mined nodes.
    let mineIcon = document.createElement('i');
    mineIcon.classList.add('fa-solid', 'fa-land-mine-on');
  
    module.removeNodeOnClickEvents();
  
    // Iterate through all mined nodes with a delay.
    let iterator = 0
    module.mineRevealerIntervalID = setInterval(() => {
      const node = document.getElementById(`grid-node-${module.gridArrayMined[iterator]}`)
        .querySelector('div');
      
      // Turn all mined nodes red.
      node.style.setProperty('background', 'red');
      
      // Add the mine icon if it was not flagged.
      if (node.querySelector('i') == null) {
        node.appendChild(mineIcon.cloneNode());
      }
      
      // Once we have iterated through all mines, clear the timer interval.
      iterator++;
      if (iterator >= module.gridArrayMined.length) {
        clearInterval(module.mineRevealerIntervalID);
        
        // Set a delay before the game over screen appears.
        module.gameOverTimeoutID = setTimeout(() => {
          module.revealGameOverScreen(true);
        }, 2000);
      }
    }, module.mineRevealDelay, iterator);
  }

  module.revealGameOverScreen = function (enable) {
    if (enable) {
      document.getElementById('game-over-menu').style.setProperty('display', 'flex');
    } else {
      document.getElementById('game-over-menu').style.setProperty('display', 'none');
    }
  }

  return module;
} (window.MINESWEEPER_MODULE = window.MINESWEEPER_MODULE || {}));