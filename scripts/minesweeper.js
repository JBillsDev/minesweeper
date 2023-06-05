const minesweeper = document.getElementById('minesweeper');
const grid = minesweeper.querySelector('.grid');
const menuBtn = document.getElementById('minesweeper-menu-btn');
// Grid Size Elements
const gridSizeBtn = document.getElementById('grid-size-btn');
const gridSizeMenu = document.getElementById('grid-size-menu');
const gridSizeSmallBtn = document.getElementById('grid-size-small');
const gridSizeMediumBtn = document.getElementById('grid-size-medium');
const gridSizeLargeBtn = document.getElementById('grid-size-large');
// Difficulty Elements
const difficultyBtn = document.getElementById('difficulty-btn');
const difficultyMenu = document.getElementById('difficulty-menu');
const difficultyEasyBtn = document.getElementById('difficulty-easy');
const difficultyMediumBtn = document.getElementById('difficulty-medium');
const difficultyHardBtn = document.getElementById('difficulty-hard');
// Timers
const mineRevealDelay = 100;
// GUI Counteers
let guiCounterMines = document.getElementById('mine-count');
let guiCounterFlags = document.getElementById('flag-count');

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

function clearGrid() {
  // Clear the empty and mined arrays
  gridArrayEmpty = [];
  gridArrayMined = [];

  // Clear the nodes from the grid
  grid.innerHTML = '';
}

function createGrid() {
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

  grid.style.gridTemplateColumns = `repeat(${gridWidth}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${gridHeight}, 1fr)`;

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
      grid.appendChild(node);

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
  guiCounterMines.innerText = chosenMineCount;
  guiCounterFlags.innerText = chosenMineCount;
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

  // Set the menu to active on click
  menuBtn.addEventListener('click', () => {
    let menu = document.getElementById('minesweeper-menu');
    if (menuBtn.classList.contains('active')) {
      menu.classList.remove('active');
      menuBtn.classList.remove('active');
      
      // Remove active class from child menus.
      difficultyBtn.classList.remove('active');
      difficultyMenu.classList.remove('active');
      gridSizeBtn.classList.remove('active');
      gridSizeMenu.classList.remove('active');
    } else {
      menu.classList.add('active');
      menuBtn.classList.add('active');
    }
  });

  // Set the grid size menu active on click.
  gridSizeBtn.addEventListener('click', () => {
    difficultyBtn.classList.remove('active');
    difficultyMenu.classList.remove('active');

    if (gridSizeBtn.classList.contains('active')) {
      gridSizeBtn.classList.remove('active');
      gridSizeMenu.classList.remove('active');
    } else {
      gridSizeBtn.classList.add('active');
      gridSizeMenu.classList.add('active');
    }
  });

  // Set the grid size buttons click callbacks
  gridSizeSmallBtn.addEventListener('click', () => setGridSize('small'));
  gridSizeMediumBtn.addEventListener('click', () => setGridSize('medium'));
  gridSizeLargeBtn.addEventListener('click', () => setGridSize('large'));

  // Set the game difficulty menu active on click.
  difficultyBtn.addEventListener('click', () => {
    gridSizeBtn.classList.remove('active');
    gridSizeMenu.classList.remove('active');

    if (difficultyBtn.classList.contains('active')) {
      difficultyBtn.classList.remove('active');
      difficultyMenu.classList.remove('active');
    } else {
      difficultyBtn.classList.add('active');
      difficultyMenu.classList.add('active');
    }
  });

  // Set the difficulty buttons click callbacks.
  difficultyEasyBtn.addEventListener('click', () => setDifficulty('easy'));
  difficultyMediumBtn.addEventListener('click', () => setDifficulty('medium'));
  difficultyHardBtn.addEventListener('click', () => setDifficulty('hard'));

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
  grid.querySelectorAll('.grid-node').forEach(node => {
    node.onclick = 0;
  });
}

function setDifficulty(difficultyString) {
  difficultyCurrent = difficultyString;

  difficultyEasyBtn.querySelector('i').classList.remove('fa-solid', 'fa-check');
  difficultyMediumBtn.querySelector('i').classList.remove('fa-solid', 'fa-check');
  difficultyHardBtn.querySelector('i').classList.remove('fa-solid', 'fa-check');

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

  createGrid()
}

function setGameOverState() {
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
  const mineIconRevealerID = setInterval(() => {
    const node = document.getElementById(`grid-node-${gridArrayMined[iterator]}`)
    .querySelector('div');
    node.appendChild(mineIcon.cloneNode());
    node.style.setProperty('background', 'red');
    
    // Once we have iterated through all mines, clear the timer interval.
    iterator++;
    if (iterator >= gridArrayMined.length) {
      clearInterval(mineIconRevealerID);
      
      // Set a delay before the game over screen appears.
      setTimeout(() => {
        revealGameOverScreen();
      }, 2000);
    }
  }, mineRevealDelay, iterator);
}

function setGridSize(gridSizeString) {
  gridSizeCurrent = gridSizeString;

  gridSizeSmallBtn.querySelector('i').classList.remove('fa-solid', 'fa-check');
  gridSizeMediumBtn.querySelector('i').classList.remove('fa-solid', 'fa-check');
  gridSizeLargeBtn.querySelector('i').classList.remove('fa-solid', 'fa-check');

  switch(gridSizeString) {
    case 'small':
      gridSizeSmallBtn.querySelector('i').classList.add('fa-solid', 'fa-check');
      grid.style.setProperty('font-size', '2rem');
      grid.style.setProperty('padding-top', '5px');
      break;
    case 'medium':
      gridSizeMediumBtn.querySelector('i').classList.add('fa-solid', 'fa-check');
      grid.style.setProperty('font-size', '1.2rem');
      grid.style.setProperty('padding-top', '3px');
      break;
    case 'large':
      gridSizeLargeBtn.querySelector('i').classList.add('fa-solid', 'fa-check');
      grid.style.setProperty('font-size', '0.8rem');
      grid.style.setProperty('padding-top', '-3px');
      break;
  }

  createGrid()
}

function updateFlagsCount() {
  guiCounterFlags.innerText = chosenMineCount - flagsPlaced;
}

init();