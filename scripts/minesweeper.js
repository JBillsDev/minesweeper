const minesweeper = document.getElementById('minesweeper');
const grid = minesweeper.querySelector('.grid');
const gridSizeBtn = document.getElementById('grid-size-btn');
const gridSizeMenu = document.getElementById('grid-size-menu');
const menuBtn = document.getElementById('minesweeper-menu-btn');
const gridSizeSmallBtn = document.getElementById('grid-size-small');
const gridSizeMediumBtn = document.getElementById('grid-size-medium');
const gridSizeLargeBtn = document.getElementById('grid-size-large');

let gridArrayEmpty = [];
let gridArrayMined = [];

const maxMinePercentage = 0.6;
let chosenMineCount = 30;
let flagPlacementEnabled = false;

let gridWidth = 0;
let gridHeight = 0;
let gridSize = 0;
let gridSizeCurrent = 'medium';

function checkForMines(index) {
  const checkedNodes = [];
  const uncheckedNodes = [index];

  let iteration = 0;
  while (uncheckedNodes.length > 0 && iteration < 100) {
    // Get valid, neighboring nodes
    const neighborArray = getNeighborNodes(uncheckedNodes[0]);

    // Determine how many neighbors contain mines.
    let neighboringMines = 0;
    for (let count = 0; count < neighborArray.length; count++) {
      if (gridArrayMined.indexOf(neighborArray[count]) != -1) {
        neighboringMines++;
      }
    }

    // Grab a reference to the current node.
    const currentNode = document
      .getElementById(`grid-node-${uncheckedNodes[0]}`);
    
    currentNode.classList.add('clicked');
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

function createGrid(mineCount) {
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

  createMines(mineCount);
}

function createMines(count) {
  const maxMineCount = Math.floor(gridArrayEmpty.length * maxMinePercentage);
  let mineCount = count;

  if (mineCount > maxMineCount) {
    mineCount = maxMineCount;
  }

  for (let index = 0; index < mineCount; ++index) {
    const rand = Math.floor(Math.random() * gridArrayEmpty.length);

    // Remove the node from the empty list
    const node = gridArrayEmpty.splice(rand, 1);
    gridArrayMined.push(node[0]);
  }
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
      gridSizeBtn.classList.remove('active');
      gridSizeMenu.classList.remove('active');
    } else {
      menu.classList.add('active');
      menuBtn.classList.add('active');
    }
  });

  // Set the grid size menu active on click
  gridSizeBtn.addEventListener('click', () => {
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

  // Set the Github link to 'beat' when moused over.
  let githubLink = document.getElementById('minesweeper-github');
  githubLink.addEventListener('mouseenter', () => {
    githubLink.classList.add('fa-beat');
  });

  githubLink.addEventListener('mouseleave', () => {
    githubLink.classList.remove('fa-beat');
  });

  // Create the default size grid.
  createGrid(chosenMineCount);
}

function onNodeClick(node, index) {
  if (flagPlacementEnabled) {
    const child = node.querySelector('div');
    if (child.innerHTML === "") {
      child.innerHTML = `<i class="fa-regular fa-flag"></i>`
    } else {
      child.innerHTML = '';
    }

    return;
  }

  // If a mine was uncovered, game over.
  if (gridArrayMined.indexOf(index) != -1) {
    // Create a new grid with the previous dimensions
    createGrid(chosenMineCount);
    return;
  }

  checkForMines(index);
}

function setGridSize(gridSizeString) {
  if (gridSizeString === gridSizeCurrent) {
    return;
  }

  gridSizeCurrent = gridSizeString;

  gridSizeSmallBtn.querySelector('i').classList.remove('fa-solid', 'fa-check');
  gridSizeMediumBtn.querySelector('i').classList.remove('fa-solid', 'fa-check');
  gridSizeLargeBtn.querySelector('i').classList.remove('fa-solid', 'fa-check');

  switch(gridSizeString) {
    case 'small':
      gridSizeSmallBtn.querySelector('i').classList.add('fa-solid', 'fa-check');
      break;
    case 'medium':
      gridSizeMediumBtn.querySelector('i').classList.add('fa-solid', 'fa-check');
      break;
    case 'large':
      gridSizeLargeBtn.querySelector('i').classList.add('fa-solid', 'fa-check');
      break;
  }

  createGrid(20)
}

init();