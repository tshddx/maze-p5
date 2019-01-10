let RED;
let BLACK;
let WHITE;

let START;
let END;

let img;
let grid = [];

function preload() {
  img = loadImage('maze.jpg');
}

function setup() {
  createCanvas(img.width, img.height);
  background(222);

  RED = color(255, 0, 0);
  BLACK = color(0, 0, 0);
  WHITE = color(255, 255, 255);

  START = [90, 80];
  END = [680, 560];

  img.loadPixels();

  // Making a 2D array
  for (let i = 0; i < img.width; i++) {
    grid[i] = new Array(img.height);
  }

  for (y = 0; y < img.height; y++) {
    for (x = 0; x < img.width; x++) {
      const index = (x + y * img.width) * 4;
      const r = img.pixels[index];
      const g = img.pixels[index + 1];
      const b = img.pixels[index + 2];
      const a = img.pixels[index + 3];
      const c = color(r, g, b);
      const v = brightness(c);
      const isWall = v < 65;
      grid[x][y] = isWall;

      if (isWall) {
        stroke(BLACK);
        point(x, y);
      } else {
        stroke(WHITE);
        point(x, y);
      }
    }
  }
}

function draw() {
  // image(img, 0, 0);

  stroke(RED);
  fill(RED);
  ellipse(START[0], START[1], 20);
  ellipse(END[0], END[1], 20);
}
