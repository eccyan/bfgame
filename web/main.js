import * as wasm from "./pkg";

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
  await wasm.init();
  bfInterpreter = new wasm.BfInterpreter();

  canvas = document.getElementById("screen");
  ctx = canvas.getContext("2d");
  imageData = ctx.createImageData(256, 240);

  resizeCanvas();

  window.requestAnimationFrame(update);
}

function update() {
  bfInterpreter.update();

  // フロントバッファの内容をCanvasに描画
  const frontBufferPtr = bfInterpreter.get_front_buffer_ptr();
  const frontBufferData = new Uint8Array(wasm.memory.buffer, frontBufferPtr, 256 * 240 * 4);
  imageData.data.set(frontBufferData);
  ctx.putImageData(imageData, 0, 0);

  window.requestAnimationFrame(update);
}

init();
