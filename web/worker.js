// importScripts("https://unpkg.com/@rustwasm/wasm-bindgen");

(async () => {
  const { default: bfgameInit, BfInterpreter } = await import("./pkg/bfgame.js");

  await bfgameInit();

  const bfInterpreter = new BfInterpreter();
  self.addEventListener("message", async (event) => {
    const { code } = event.data;
    bfInterpreter.execute(code);
    bfInterpreter.update();

    const buffer = new Uint8ClampedArray(bfInterpreter.copy_front_buffer());
    postMessage({ type: "done", buffer: buffer });
  });
})();
