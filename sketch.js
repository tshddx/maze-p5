let RED;
let PINK;
let BLACK;
let WHITE;

let START;
let END;
let START_NODE;
let END_NODE;
let PER_FRAME = 1500;
let LINE_PER_FRAME = 30;
const THRESHOLD = 70;

let img;
let grid = [];
let queue = [];

function preload() {
  img = loadImage('maze-big.jpg');
}

function setup() {
  createCanvas(img.width, img.height);
  background(222);

  RED = color(255, 55, 0, 35);
  PINK = color(200, 200, 0, 50);
  BLACK = color(0, 0, 0);
  WHITE = color(255, 255, 255);

  START = [
    Math.round((img.width * 90) / 800),
    Math.round((img.height * 80) / 625),
  ];
  END = [
    Math.round((img.width * 680) / 800),
    Math.round((img.height * 560) / 625),
  ];

  img.loadPixels();

  // Populate grid.
  for (let i = 0; i < img.width; i++) {
    grid[i] = new Array(img.height);
    for (let j = 0; j < img.height; j++) {
      grid[i][j] = {
        coords: [i, j],
        isWall: null,
        isCloseToWall: false,
        visited: false,
        done: false,
        previous: null,
        distanceFromStart: null,
        totalDistanceEstimate: null,
      };
    }
  }

  for (y = 0; y < img.height; y++) {
    for (x = 0; x < img.width; x++) {
      const index = (x + y * img.width) * 4;
      const r = img.pixels[index];
      const g = img.pixels[index + 1];
      const b = img.pixels[index + 2];
      // const a = img.pixels[index + 3];
      const c = color(r, g, b);
      const v = brightness(c);

      const isWall = v < THRESHOLD;
      const node = grid[x][y];
      node.isWall = isWall;

      if (isWall) {
        stroke(BLACK);
        point(x, y);
      } else {
        stroke(WHITE);
        point(x, y);
      }
    }
  }

  for (y = 0; y < img.height; y++) {
    for (x = 0; x < img.width; x++) {
      const node = getNode(x, y);
      const neighbors = getNeighbors(node, 1);
      if (node.isWall || neighbors.some(n => n.isWall)) {
        node.isCloseToWall = true;
      }
      if (node.isCloseToWall) {
        stroke(BLACK);
        point(x, y);
      } else {
        stroke(WHITE);
        point(x, y);
      }
    }
  }

  START_NODE = getNode(START[0], START[1]);
  END_NODE = getNode(END[0], END[1]);
  queue.push(START_NODE);
  START_NODE.distanceFromStart = 0;
  START_NODE.totalDistanceEstimate = dist(START[0], START[1], END[0], END[1]);

  image(img, 0, 0);

  stroke(color(0, 0, 255));
  fill(color(0, 0, 255));
  ellipse(START[0], START[1], 40, 40);

  stroke(color(0, 255, 0));
  fill(color(0, 255, 0));
  ellipse(END[0], END[1], 40, 40);
}

function mouseClicked() {
  noLoop();
}

let finished = false;
let solutionNode = null;

function draw() {
  if (!finished) {
    for (let i = 0; i < PER_FRAME; i++) {
      if (queue.length === 0) {
        noLoop();
        break;
      }

      const current = queue.shift();
      if (current.coords[0] === END[0] && current.coords[1] === END[1]) {
        finished = true;
        solutionNode = current;
        break;
      }

      current.done = true;
      const neighbors = getNeighbors(current);
      neighbors.forEach(neighbor => {
        if (neighbor.isWall) {
          return;
        }
        if (neighbor.isCloseToWall) {
          return;
        }
        if (neighbor.done) {
          return;
        }

        const estimate =
          current.distanceFromStart + getEstimate(current, neighbor);

        if (!neighbor.visited) {
          neighbor.visited = true;
          queue.push(neighbor);
          stroke(PINK);
          point(neighbor.coords[0], neighbor.coords[1]);
        } else if (estimate >= neighbor.distanceFromStart) {
          return;
        }

        neighbor.previous = current;
        neighbor.distanceFromStart = estimate;
        neighbor.totalDistanceEstimate =
          neighbor.distanceFromStart + getEstimate(neighbor, END_NODE);
      });
    }
  } else {
    // We have a solution.
    for (let i = 0; i < LINE_PER_FRAME; i++) {
      if (!solutionNode.previous) {
        noLoop();
        return;
      }
      stroke(RED);
      strokeWeight(6);
      const previous = solutionNode.previous;
      line(
        solutionNode.coords[0],
        solutionNode.coords[1],
        previous.coords[0],
        previous.coords[1]
      );
      solutionNode = previous;
    }
  }
}

function getNode(x, y) {
  const row = grid[x];
  if (!row) {
    return null;
  }
  const node = row[y];
  return node;
}

function getPlusNeighborCoords(x, y) {
  return [
    // keep
    [x, y - 1],
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
  ];
}
function getNeighborCoords(x, y, padding = 1) {
  const coords = [];
  for (let i = -padding; i <= padding; i++) {
    for (let j = -padding; j <= padding; j++) {
      const coord = [x + i, y + j];
      if (coord[0] === x && coord[1] === y) {
        // Don't add self as a neighbor.
      } else {
        coords.push(coord);
      }
    }
  }

  return coords;

  return [
    [x - 1, y - 1],
    [x, y - 1],
    [x + 1, y - 1],
    [x - 1, y],
    [x + 1, y],
    [x - 1, y + 1],
    [x, y - 1],
    [x + 1, y + 1],
  ];
}

function getPlusNeighbors(node) {
  const [x, y] = node.coords;
  return getPlusNeighborCoords(node.coords[0], node.coords[1])
    .map(([x, y]) => getNode(x, y))
    .filter(n => n);
}

function getNeighbors(node, padding = 1) {
  const [x, y] = node.coords;
  return getNeighborCoords(x, y, padding)
    .map(([x, y]) => getNode(x, y))
    .filter(n => n);
}

function getEstimate(a, b) {
  return dist(a.coords[0], a.coords[1], b.coords[0], b.coords[1]);
}
