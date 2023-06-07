(function (module) {
  module.closeGameEndMenus = function () {
    module.revealGameOverMenu(false);
    module.revealWinMenu(false);
  }

  module.revealGameOverMenu = function (enable) {
    const value = (enable ? 'flex' : 'none');
    document.getElementById(module.HTMLGameOverMenuID).style
      .setProperty('display', value);
  }

  module.revealWinMenu = function (enable) {
    const value = (enable ? 'flex' : 'none');
    document.getElementById(module.HTMLGameWinMenuID).style
      .setProperty('display', value);
  }

  // Set the Game Over menu buttons click callbacks.
  module.setGameOverCallbacks = function () {
    const gameOverMenu = document
      .getElementById(module.HTMLGameOverMenuID);

    gameOverMenu.querySelector(module.HTMLBtnYesQuery)
      .addEventListener('click', () => {
      module.startNewGame();
      gameOverMenu.style.setProperty('display', 'none');
    });

    gameOverMenu.querySelector(module.HTMLBtnNoQuery)
      .addEventListener('click', () => {
      gameOverMenu.style.setProperty('display', 'none');
    });
  }

  module.setGameOverState = function () {
    const minesweeper = document.getElementById(module.HTMLMinesweeperID);
    const gameOverClass = 'game-over';

    // Trigger the red flash of the mine blowing up.
    minesweeper.classList.add(gameOverClass);
    // Set the timer for the red flash class to be removed.
    setTimeout(() => {
      minesweeper.classList.remove(gameOverClass);
    }, 500);
  
    // Prevent further nodes from being interacted with.
    module.removeNodeInteractions();
  
    // Create the mine icon to place within mined nodes.
    let mineIcon = document.createElement('i');
    mineIcon.classList.add('fa-solid', 'fa-land-mine-on');
  
    // Iterate through all mined nodes with a delay.
    let iterator = 0
    module.mineRevealerIntervalID = setInterval(() => {
      const node = document.getElementById(`grid-node-${module.gridArrayMined[iterator]}`)
        .querySelector('div');
      
      // Turn all mined nodes red.
      node.style.setProperty('background', 'red');
      
      if (iterator == 0) {
        // Add the explosion icon if it was the node the player clicked on.
        const explosion = document.createElement('i');
        explosion.classList.add('fa-solid', 'fa-explosion');
        node.appendChild(explosion);
        node.style.setProperty('background', '#333');
        node.style.setProperty('color', 'red');
        node.style.setProperty('border', '4px #999 solid');
      }else if (node.querySelector('i') == null) {
        // Add the mine icon if it was not flagged.
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
    const gameWinMenu = document
      .getElementById(module.HTMLGameWinMenuID);
    
    gameWinMenu.querySelector(module.HTMLBtnYesQuery)
      .addEventListener('click', () => {
      module.startNewGame();
      gameWinMenu.style.setProperty('display', 'none');
    });

    gameWinMenu.querySelector(module.HTMLBtnNoQuery)
      .addEventListener('click', () => {
      gameWinMenu.style.setProperty('display', 'none');
    });
  }

  module.setGameWinState = function () {
    module.removeNodeInteractions();
    module.revealWinMenu(true);
  }

  return module;
} (window.MINESWEEPER_MODULE = window.MINESWEEPER_MODULE || {}));