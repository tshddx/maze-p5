let RED;
let START;
let END;
let img;

function preload() {
  img = loadImage('maze.jpg');
}

function setup() {
  RED = color(255, 0, 0);
  START = [90, 80];
  END = [680, 560];
  createCanvas(img.width, img.height);
  background(222);
}

function draw() {
  image(img, 0, 0);

  stroke(RED);
  fill(RED);
  ellipse(START[0], START[1], 20);
  ellipse(END[0], END[1], 20);
}
