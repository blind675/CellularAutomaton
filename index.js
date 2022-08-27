const WORLD_WIDTH = 32;
const WORLD_HEIGHT = 32;

const LIVE_CELL = " # ";
const DEAD_CELL = "   ";

const INTERVAL = 200;

const RESET_AT_GENERATION = 1000; // 0 = no reset
const RESET_CELL_INACTIVITY_THRESHOLD = 3;
const RESET_CELL_INACTIVITY_TIMES = 15;

let generation = 1;
let lastGenerationLiveCellsCount = 0;
let lowCellActivityCount = 0;

const world = Array.apply(null, Array(WORLD_HEIGHT)).map(function () {
  return Array.apply(null, Array(WORLD_WIDTH)).map(function () {
    return " ";
  });
});

function randomizeWorld() {
  for (let i = 0; i < world.length; i++) {
    for (let j = 0; j < world[i].length; j++) {
      world[i][j] =
        Math.floor(Math.random() * 15) === 1 ? LIVE_CELL : DEAD_CELL;
    }
  }
}

function updateWorld() {
  // cellular automata rules
  // 1. Any live cell with fewer than two live neighbours dies, as if caused by under-population.
  // 2. Any live cell with two or three live neighbours lives on to the next generation.
  // 3. Any live cell with more than three live neighbours dies, as if by over-population.
  // 4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

  let liveCellsCount = 0;

  for (let i = 0; i < world.length; i++) {
    for (let j = 0; j < world[i].length; j++) {
      if (world[i][j] === LIVE_CELL) {
        liveCellsCount++;
      }

      let neighbors = 0;
      for (let k = -1; k <= 1; k++) {
        for (let l = -1; l <= 1; l++) {
          let heightIndex = i + k;
          if (heightIndex < 0) {
            // heightIndex = world.length - 1;
            heightIndex = 0;
          }
          if (heightIndex > world.length - 1) {
            // heightIndex = 0;
            heightIndex = world.length - 1;
          }

          let widthIndex = j + l;
          if (widthIndex < 0) {
            // widthIndex = world[i].length - 1;
            widthIndex = 0;
          }
          if (widthIndex > world[i].length - 1) {
            // widthIndex = 0;
            widthIndex = world[i].length - 1;
          }

          if (world[heightIndex][widthIndex] === LIVE_CELL) {
            neighbors++;
          }
        }
      }
      if (world[i][j] === LIVE_CELL) {
        if (neighbors < 2 || neighbors > 3) {
          world[i][j] = DEAD_CELL;
        }
      } else {
        if (neighbors === 3) {
          world[i][j] = LIVE_CELL;
        }
      }
    }
  }

  return liveCellsCount;
}

function printWorld() {
  console.clear();
  for (let i = 0; i < world.length; i++) {
    let row = world[i].join("");
    console.log(row);
  }
}

function start() {
  console.log("Starting...");
  randomizeWorld();
  printWorld();

  setInterval(function () {
    if (RESET_AT_GENERATION === generation) {
      randomizeWorld();
      generation = 1;
    }
    const liveCellCount = updateWorld();

    if (
      RESET_AT_GENERATION > 0 &&
      Math.abs(liveCellCount - lastGenerationLiveCellsCount) <
        RESET_CELL_INACTIVITY_THRESHOLD
    ) {
      lowCellActivityCount++;
    } else {
      lowCellActivityCount = 0;
    }

    if (lowCellActivityCount === RESET_CELL_INACTIVITY_TIMES) {
      randomizeWorld();
      generation = 0;
      lowCellActivityCount = 0;
    }
    
    printWorld();
    generation++;
    lastGenerationLiveCellsCount = liveCellCount;
  }, INTERVAL);
}

start();
