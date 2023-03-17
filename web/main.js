import { default as bfgameInit, BfInterpreter } from "./pkg/bfgame.js";

let bfInterpreter;
let canvas;
let ctx;
let imageData;

function resizeCanvas() {
  const screenWidth = window.innerWidth;
  const scaleFactor = screenWidth * 0.6 / 256;

  canvas.style.width = `${256 * scaleFactor}px`;
  canvas.style.height = `${240 * scaleFactor}px`;
}

window.addEventListener("resize", resizeCanvas);

async function init() {
  await bfgameInit();
  bfInterpreter = new BfInterpreter();
  bfInterpreter.execute(`
    ++++++++++[>+>+++>+++++++>++++++++++<<<<-]>>>++++++++++>->-------->++++++>-->++>++++>->++>++++++[--<++++>----<]>-.>++++++[->++<]>+.>++++[->++<]>.
` );

  canvas = document.getElementById("screen");
  ctx = canvas.getContext("2d");
  imageData = ctx.createImageData(256, 240);

  resizeCanvas();

  window.requestAnimationFrame(update);
}

function update() {
  bfInterpreter.update();

  // フロントバッファの内容をCanvasに描画
  const buffer = new Uint8Array(bfInterpreter.copy_front_buffer());
  imageData.data.set(buffer);
  ctx.putImageData(imageData, 0, 0);

  window.requestAnimationFrame(update);
}

init();
