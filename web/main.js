import { default as bfgameInit, BfInterpreter } from "./pkg/bfgame.js";

let bfInterpreter;
let canvas;
let ctx;
let imageData;

async function init() {
  await bfgameInit();
  bfInterpreter = new BfInterpreter();
  bfInterpreter.execute(`
one cell is one byte
-                    cell to 255
[>- ---------------- cell to 239
 [>-.+               next cell to 255 and out
  >---.>--.>-.       0 and out
 <<<<-]              loop
+<-]                 loop
`);
  bfInterpreter.update();

  canvas = document.getElementById("screen");
  ctx = canvas.getContext("2d");
  imageData = ctx.createImageData(256, 240);

  window.requestAnimationFrame(update);
}

function update() {
  const buffer = new Uint8ClampedArray(bfInterpreter.copy_front_buffer());

  imageData.data.set(buffer);
  ctx.putImageData(imageData, 0, 0);
  bfInterpreter.update();

  window.requestAnimationFrame(update);
}

init();
