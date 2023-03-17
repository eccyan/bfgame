const width = 256;
const height = 240;
const scaleFactor = window.devicePixelRatio || 1;

let canvas;
let ctx;
let imageData;

async function init() {
  canvas = document.getElementById("screen");
  ctx = canvas.getContext("2d");
  imageData = ctx.createImageData(256, 240);

  resizeCanvas();
}

function resizeCanvas() {
  const width = 256;
  const height = 240;
  const scaleFactor = window.devicePixelRatio || 1;

  canvas.width = width * scaleFactor;
  canvas.height = height * scaleFactor;

  ctx.scale(scaleFactor, scaleFactor);
}

window.addEventListener("resize", resizeCanvas);

function update(buffer) {
  imageData.data.set(buffer);
  const _canvas = document.createElement('canvas');
  const _ctx = _canvas.getContext('2d');
  _canvas.width = width; _canvas.height = height;
  _ctx.putImageData(imageData, 0, 0);
  ctx.drawImage(_canvas, 0, 0, width, height);
}

const worker = new Worker("worker.js");
const bfCodeInput = document.getElementById("bf-code");
const runButton = document.getElementById("run-btn");

runButton.addEventListener("click", () => {
  const bfCode = bfCodeInput.value;
  worker.postMessage({
    command: "execute",
    code: bfCode,
  });
});


worker.onmessage = (event) => {
  const { data } = event;
  if (data.type === "done") {
    console.log("done the BF code executed in worker");
    console.log(data.buffer);
    window.requestAnimationFrame(() => update(data.buffer));
  }
  if (data.command === "executed") {
    console.log("BF code executed in worker");
  }
};

/*
worker.postMessage({
  command: "init",
  path: "./pkg/bfgame_bg.wasm",
});
*/


init();
