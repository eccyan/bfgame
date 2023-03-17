import { default as bfgameInit, BfInterpreter } from "./pkg/bfgame.js";

const width = 256;
const height = 240;
const scaleFactor = window.devicePixelRatio || 1;

let bfInterpreter;
let canvas;
let ctx;
let imageData;

async function init() {
  await bfgameInit();
  bfInterpreter = new BfInterpreter();

  canvas = document.getElementById("screen");
  ctx = canvas.getContext("2d");

  canvas.width = width * scaleFactor;
  canvas.height = height * scaleFactor;

  ctx.scale(scaleFactor, scaleFactor);

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

const bfCodeInput = document.getElementById("bf-code");
const runButton = document.getElementById("run-btn");

runButton.addEventListener("click", () => {
  const bfCode = bfCodeInput.value;
  // Workerを使用している場合は、worker.postMessageを使用します
  // worker.postMessage({ command: "execute", source: bfCode });
  bfInterpreter.execute(bfCode);
  bfInterpreter.update();
});

init();
