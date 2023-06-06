(function (module) {
  module.gameOverTimeoutID = 0;

  module.revealGameOverMenu = function (enable) {
    const value = (enable ? 'flex' : 'none');
    document.getElementById('game-over-menu').style.setProperty('display', value);
  }

  module.revealWinMenu = function (enable) {
    const value = (enable ? 'flex' : 'none');
    document.getElementById('win-menu').style.setProperty('display', value);
  }

  // Set the Game Over menu buttons click callbacks.
  module.setGameOverCallbacks = function () {
    const gameOverMenu = document.getElementById('game-over-menu');

    gameOverMenu.querySelector('.game-end-yes').addEventListener('click', () => {
      module.startNewGame();
      gameOverMenu.style.setProperty('display', 'none');
    });

    gameOverMenu.querySelector('.game-end-no').addEventListener('click', () => {
      gameOverMenu.style.setProperty('display', 'none');
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
          module.revealGameOverMenu(true);
        }, 2000);
      }
    }, module.mineRevealDelay, iterator);
  }

  // Set the Game Win menu buttons click callbacks.
  module.setGameWinCallbacks = function () {
    const gameWinMenu = document.getElementById('win-menu');
    
    gameWinMenu.querySelector('.game-end-yes').addEventListener('click', () => {
      module.startNewGame();
      gameWinMenu.style.setProperty('display', 'none');
    });

    gameWinMenu.querySelector('.game-end-no').addEventListener('click', () => {
      gameWinMenu.style.setProperty('display', 'none');
    });
  }

  module.setGameWinState = function () {
    module.removeNodeOnClickEvents();
    module.revealWinMenu(true);
  }

  return module;
} (window.MINESWEEPER_MODULE = window.MINESWEEPER_MODULE || {}));