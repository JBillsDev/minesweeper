// Timers and Delays
let gameOverTimeoutID = 0;
let mineRevealerIntervalID = 0;
const mineRevealDelay = 100;

let gridArrayEmpty = [];
let gridArrayMined = [];

let chosenMineCount = 0;
let flagsPlaced = 0;
let flagPlacementEnabled = false;

let gridWidth = 0;
let gridHeight = 0;
let gridSize = 0;
let gridSizeCurrent = 'medium';
let difficultyCurrent = 'medium';

function clearGrid() {
  // Clear the empty and mined arrays
  gridArrayEmpty = [];
  gridArrayMined = [];

  // Clear the nodes from the grid
  document.getElementById('game-grid').innerHTML = '';
}

function closeDifficultyMenu() {
  document.getElementById('difficulty-btn').classList.remove('active');
  document.getElementById('difficulty-menu').classList.remove('active');
}

// Close all menus open in the main hamburger menu.
function closeFullMenu() {
  closeDifficultyMenu();
  closeGridSizeMenu();
  closeHamburgerMenu();
}

function closeGridSizeMenu() {
  document.getElementById('grid-size-btn').classList.remove('active');
  document.getElementById('grid-size-menu').classList.remove('active');
}

function closeHamburgerMenu() {
  document.getElementById('minesweeper-menu-btn').classList
    .remove('active');
  document.getElementById('minesweeper-menu').classList
    .remove('active');
}

function createGrid() {
  // Clear any existing interval
  clearInterval(mineRevealerIntervalID);
  clearTimeout(gameOverTimeoutID);

  // Clear the existing grid.
  clearGrid();
  
  switch(gridSizeCurrent) {
    case 'small':
      gridWidth = 8;
      break;
    case 'medium':
      gridWidth = 10;
      break;
    case 'large':
      gridWidth = 14;
      break;
  }
  
  gridHeight = Math.floor(gridWidth * 1.5);
  gridSize = gridWidth * gridHeight;

  // Grab reference to game grid
  const gameGrid = document.getElementById('game-grid');

  // Set the CSS grid dimensions
  gameGrid.style.gridTemplateColumns = `repeat(${gridWidth}, 1fr)`;
  gameGrid.style.gridTemplateRows = `repeat(${gridHeight}, 1fr)`;

  let index = 0;
  for (let y = 0; y < gridHeight; ++y) {
    for (let x = 0; x < gridWidth; ++x) {
      // Create the grid node
      const node = document.createElement('div');
      node.id = `grid-node-${index}`;
      node.classList.add('grid-node');

      // Add callback for user click
      /* Passing in the index value would leave all onNodeClick
      callbacks referencing the final index value from this loop.
      Pass in the direct value instead. */
      node.onclick = () => onNodeClick(node, (y * gridWidth) + x);

      // Create inner element used for styling
      const nodeInner = document.createElement('div');

      // Append nodes
      node.appendChild(nodeInner);
      gameGrid.appendChild(node);

      gridArrayEmpty.push(index);
      index++;
    }
  }

  createMines();
}

function createMines() {
  // Determine total mine count from grid size and difficulty.
  switch(difficultyCurrent) {
    case 'easy':
      chosenMineCount = Math.floor(gridSize * 0.15);
      break;
    case 'medium':
      chosenMineCount = Math.floor(gridSize * 0.25);
      break;
    case 'hard':
      chosenMineCount = Math.floor(gridSize * 0.33);
      break;
  }

  // Select random nodes to receive mines.
  for (let index = 0; index < chosenMineCount; ++index) {
    const rand = Math.floor(Math.random() * gridArrayEmpty.length);

    // Remove the node from the empty list.
    const node = gridArrayEmpty.splice(rand, 1);
    gridArrayMined.push(node[0]);
  }

  // Update GUI for mine and flag count.
  document.getElementById('mine-count').innerText = chosenMineCount;
  document.getElementById('flag-count').innerText = chosenMineCount;
  // Reset the flags placed counter.
  flagsPlaced = 0;
}

function getNeighborNodes(index) {
  const neighborArray = [];

  // Determine if the current node exists against a border.
  if (index === 0) {
    // Node is in the top-left corner.
    neighborArray.push(
      index + 1,              // right
      index + gridWidth,      // bottom
      index + gridWidth + 1); // bottom-right
  } else if (index < gridWidth - 1) {
    // Node is against the top border, not in a corner.
    neighborArray.push(
      index - 1,              // left
      index + 1,              // right
      index + gridWidth - 1,  // bottom-left
      index + gridWidth,      // bottom
      index + gridWidth + 1); // bottom-right
  } else if (index === gridWidth - 1) {
    // Node is in the top-right corner.
    neighborArray.push(
      index - 1,            // left
    index + gridWidth - 1,  // bottom-left
    index + gridWidth);     // bottom
  } else if (index === gridSize - gridWidth) {
    // Node is in the bottom-left corner.
    neighborArray.push(
      index - gridWidth,      // top
      index - gridWidth + 1,  // top-right
      index + 1);             // right
  } else if (index === gridSize - 1) {
    // Node is in the bottom-right corner.
    neighborArray.push(
      index - gridWidth - 1,  // top-left
      index - gridWidth,      // top
      index - 1);             // left
  } else if (index % gridWidth === 0) {
    // Node is on the left border.
    neighborArray.push(
      index - gridWidth,     // top
      index - gridWidth + 1,  // top-right
      index + 1,              // right
      index + gridWidth,      // bottom
      index + gridWidth + 1); // bottom-right
  } else if (index % gridWidth === gridWidth - 1) {
    // Node is on the right border.
    neighborArray.push(
      index - gridWidth - 1,  // top-left
      index - gridWidth,      // top
      index - 1,              // left
      index + gridWidth - 1,  // bottom-left
      index + gridWidth);     // bottom
  } else if (index >= gridSize - gridWidth) {
    // Node is against the bottom border, not in a corner.
    neighborArray.push(
      index - gridWidth - 1,  // top-left
      index - gridWidth,      // top
      index - gridWidth + 1,  // top-right
      index - 1,              // left
      index + 1);             // right
  } else {
    // Node is not against any border
    neighborArray.push(
      index - gridWidth - 1,  // top-left
      index - gridWidth,      // top
      index - gridWidth + 1,  // top-right
      index - 1,              // left
      index + 1,              // right
      index + gridWidth - 1,  // bottom-left
      index + gridWidth,      // bottom
      index + gridWidth + 1); // bottom-right
  }

  return neighborArray;
}

// Search an array of neighboring nodes for total number of mines.
function getNeighboringMinesCount(neighborArray) {
  let neighboringMines = 0;
  for (let count = 0; count < neighborArray.length; count++) {
    if (gridArrayMined.indexOf(neighborArray[count]) != -1) {
      neighboringMines++;
    }
  }

  return neighboringMines;
}

function init() {
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

  // Set the menu to active or inactive on click.
  document.getElementById('minesweeper-menu-btn')
    .addEventListener('click', () => {
    const menuBtn = document.getElementById('minesweeper-menu-btn');
    if (menuBtn.classList.contains('active')) {
      closeFullMenu();
    } else {
      document.getElementById('minesweeper-menu')
        .classList.add('active');
      menuBtn.classList.add('active');
    }
  });

  // Set the grid size menu active on click.
  document.getElementById('grid-size-btn')
    .addEventListener('click', () => {
    // Make sure difficulty menu is not open at the same time.
    closeDifficultyMenu();

    const gridSizeBtn = document.getElementById('grid-size-btn');
    if (gridSizeBtn.classList.contains('active')) {
      closeGridSizeMenu();
    } else {
      gridSizeBtn.classList.add('active');
      document.getElementById('grid-size-menu').classList.add('active');
    }
  });

  // Set the grid size buttons click callbacks
  document.getElementById('grid-size-small')
    .addEventListener('click', () => {
    setGridSize('small');
    createGrid();
    closeFullMenu();
  });

  document.getElementById('grid-size-medium')
    .addEventListener('click', () => {
    setGridSize('medium');
    createGrid();
    closeFullMenu();
  });

  document.getElementById('grid-size-large')
    .addEventListener('click', () => {
    setGridSize('large');
    createGrid();
    closeFullMenu();
  });

  // Set the game difficulty menu active on click.
  document.getElementById('difficulty-btn')
    .addEventListener('click', () => {
    // Make sure grid size menu is not open at the same time.
    closeGridSizeMenu();

    const difficultyBtn = document.getElementById('difficulty-btn');
    if (difficultyBtn.classList.contains('active')) {
      closeDifficultyMenu();
    } else {
      difficultyBtn.classList.add('active');
      document.getElementById('difficulty-menu').classList.add('active');
    }
  });

  // Set the difficulty buttons click callbacks.
  document.getElementById('difficulty-easy')
    .addEventListener('click', () => {
    setDifficulty('easy');
    createGrid();
    closeFullMenu();
  });

  document.getElementById('difficulty-medium')
    .addEventListener('click', () => {
    setDifficulty('medium');
    createGrid();
    closeFullMenu();
  });

  document.getElementById('difficulty-hard')
    .addEventListener('click', () => {
    setDifficulty('hard');
    createGrid();
    closeFullMenu();
  });

  // Set the Game Over menu buttons click callbacks.
  document.getElementById('game-over-yes').addEventListener('click', () => {
    createGrid();
    document.getElementById('game-over-menu').style
      .setProperty('display', 'none');
  });

  document.getElementById('game-over-no').addEventListener('click', () => {
    document.getElementById('game-over-menu').style
      .setProperty('display', 'none');
  });

  // Set the Github link to 'beat' when moused over.
  const githubLink = document.getElementById('minesweeper-github');
  githubLink.addEventListener('mouseenter', () => {
    githubLink.classList.add('fa-beat');
  });

  githubLink.addEventListener('mouseleave', () => {
    githubLink.classList.remove('fa-beat');
  });

  setDifficulty('medium');
  setGridSize('medium');

  // Create the default size grid.
  createGrid();
}

function onNodeClick(node, index) {
  if (flagPlacementEnabled) {
    const child = node.querySelector('div');

    /* If flag placement is currently enabled, spend a flag
    to mark the node, and remove 1 from the GUI flag counter.
    Else, remove the flag marg, and return 1 flag. */
    if (child.innerHTML === "") {
      // If no flags remaining, return.
      if (chosenMineCount - flagsPlaced <= 0) {
        return;
      }

      child.innerHTML = `<i class="fa-regular fa-flag"></i>`
      flagsPlaced++;
      updateFlagsCount();
    } else {
      child.innerHTML = '';
      flagsPlaced--;
      updateFlagsCount();
    }

    return;
  }

  // If a mine was uncovered, game over.
  if (gridArrayMined.indexOf(index) != -1) {
    setGameOverState();

    return;
  }

  searchForNearbyMines(index);
}

function revealGameOverScreen() {
  document.getElementById('game-over-menu').style.setProperty('display', 'flex');
}

function removeNodeOnClickEvents() {
  document.getElementById('game-grid').querySelectorAll('.grid-node')
    .forEach(node => {
    node.onclick = 0;
  });
}

function searchForNearbyMines(index) {
  const checkedNodes = [];
  const uncheckedNodes = [index];

  // Prevent getting stuck in loop if logic fails.
  let iteration = 0;
  const maxIterations = 1000;
  while (uncheckedNodes.length > 0 && iteration < 1000) {
    // Get valid, neighboring nodes
    const neighborArray = getNeighborNodes(uncheckedNodes[0]);

    // Determine how many neighbors contain mines.
    let neighboringMines = getNeighboringMinesCount(neighborArray);

    // Grab a reference to the current node.
    const currentNode = document
      .getElementById(`grid-node-${uncheckedNodes[0]}`);
    // Set the node to 'clicked'.
    currentNode.classList.add('clicked');
    // Remove the node's onclick function.
    currentNode.onclick = 0;

    /* If node has any neighboring mines, display the number of
    neighboring mines, and do not add neighbors to uncheckedNodes.
    Otherwise, show an empty tile as clicked. */
    if (neighboringMines != 0) {
      currentNode.querySelector('div').textContent = neighboringMines;
      
      // Return if the is the original node clicked.
      if (index == uncheckedNodes[0]) {
        return;
      }
    } else {
      /* If node does not have any mines for neighbors, check all of
      its neighboring nodes, making sure not to add a node that has
      already been evaluated, or marked for evaluation, to either list. */
      for (let i = 0; i < neighborArray.length; ++i) {
        const value = neighborArray[i];
        if (checkedNodes.indexOf(value) === -1) {
          if (uncheckedNodes.indexOf(value) === -1) {
            uncheckedNodes.push(value);
          }
        }
      }
    }

    // Move the current node to the checked list.
    checkedNodes.push(uncheckedNodes.shift());

    iteration++;
  }
}

function setDifficulty(difficultyString) {
  difficultyCurrent = difficultyString;

  // Get difficulty button elements.
  const difficultyEasyBtn = document.getElementById('difficulty-easy');
  const difficultyMediumBtn = document.getElementById('difficulty-medium');
  const difficultyHardBtn = document.getElementById('difficulty-hard');
  
  // Remove the existing check mark.
  difficultyEasyBtn.querySelector('i').classList.remove('fa-solid', 'fa-check');
  difficultyMediumBtn.querySelector('i').classList.remove('fa-solid', 'fa-check');
  difficultyHardBtn.querySelector('i').classList.remove('fa-solid', 'fa-check');

  // Add the check mark to the newly selected difficulty.
  switch(difficultyCurrent) {
    case 'easy':
      difficultyEasyBtn.querySelector('i').classList.add('fa-solid', 'fa-check');
      break;
    case 'medium':
      difficultyMediumBtn.querySelector('i').classList.add('fa-solid', 'fa-check');
      break;
    case 'hard':
      difficultyHardBtn.querySelector('i').classList.add('fa-solid', 'fa-check');
      break;
  }
}

function setGameOverState() {
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

  removeNodeOnClickEvents();

  // Iterate through all mined nodes with a delay.
  let iterator = 0
  mineRevealerIntervalID = setInterval(() => {
    const node = document.getElementById(`grid-node-${gridArrayMined[iterator]}`)
      .querySelector('div');
    
    // Turn all mined nodes red.
    node.style.setProperty('background', 'red');
    
    // Add the mine icon if it was not flagged.
    if (node.querySelector('i') == null) {
      node.appendChild(mineIcon.cloneNode());
    }
    
    // Once we have iterated through all mines, clear the timer interval.
    iterator++;
    if (iterator >= gridArrayMined.length) {
      clearInterval(mineRevealerIntervalID);
      
      // Set a delay before the game over screen appears.
      gameOverTimeoutID = setTimeout(() => {
        revealGameOverScreen();
      }, 2000);
    }
  }, mineRevealDelay, iterator);
}

function setGridSize(gridSizeString) {
  gridSizeCurrent = gridSizeString;

  // Get grid size button elements.
  const gridSizeSmallBtn = document.getElementById('grid-size-small');
  const gridSizeMediumBtn = document.getElementById('grid-size-medium');
  const gridSizeLargeBtn = document.getElementById('grid-size-large');

  // Remove the existing check mark.
  gridSizeSmallBtn.querySelector('i').classList.remove('fa-solid', 'fa-check');
  gridSizeMediumBtn.querySelector('i').classList.remove('fa-solid', 'fa-check');
  gridSizeLargeBtn.querySelector('i').classList.remove('fa-solid', 'fa-check');

  // Grab reference to game grid
  const gameGrid = document.getElementById('game-grid');

  /* Add the check mark to the newly selected grid size, and update the
  relevant grid display properties to adapt to the new node size. */
  switch(gridSizeString) {
    case 'small':
      gridSizeSmallBtn.querySelector('i').classList.add('fa-solid', 'fa-check');
      gameGrid.style.setProperty('font-size', '2rem');
      gameGrid.style.setProperty('padding-top', '5px');
      break;
    case 'medium':
      gridSizeMediumBtn.querySelector('i').classList.add('fa-solid', 'fa-check');
      gameGrid.style.setProperty('font-size', '1.2rem');
      gameGrid.style.setProperty('padding-top', '3px');
      break;
    case 'large':
      gridSizeLargeBtn.querySelector('i').classList.add('fa-solid', 'fa-check');
      gameGrid.style.setProperty('font-size', '0.8rem');
      gameGrid.style.setProperty('padding-top', '-3px');
      break;
  }
}

function updateFlagsCount() {
  document.getElementById('flag-count').innerText = chosenMineCount - flagsPlaced;
}

init();