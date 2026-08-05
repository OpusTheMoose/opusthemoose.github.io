import type { IRenderer } from "./IRenderer";
import { WebGPURenderer } from "./renderers/webgpu";
import { WebGLRenderer } from "./renderers/webgl";

 async function main() {
        const canvas = document.querySelector("canvas");
        if (!canvas) {
            throw new Error("Failed to get canvas")
        }
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        var backend : IRenderer
        backend = new WebGLRenderer
        backend.init(canvas)

       window.addEventListener('resize', () => {
            backend.resize(window.innerWidth, window.innerHeight)
       });
       

}

main();