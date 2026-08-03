import type { IRenderer } from "./IRenderer";
import { WebGPURenderer } from "./renderers/webgpu";

 async function main() {
        const canvas = document.querySelector("canvas");
        if (!canvas) {
            throw new Error("Failed to get canvas")
        }
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        var backend : IRenderer
        var context = canvas.getContext("webgpu") as GPUCanvasContext | null;
        // fall back to webgl
        if (!context) {
            
            context = canvas.getContext("webgl2") as GPUCanvasContext | null;
        
        }
        else {
            backend = new WebGPURenderer
            backend.init(canvas, context)
        }
        



       

}

main();