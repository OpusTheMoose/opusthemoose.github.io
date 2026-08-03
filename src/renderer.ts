import triangleShader from "../shaders/square.wgsl?raw";

 async function main() {
        const canvas = document.querySelector("canvas");
        if (!canvas) {
            throw new Error("Failed to get canvas")
        }
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

      // Your WebGPU code will begin here!
        if (!navigator.gpu) {
            throw new Error("WebGPU not supported on this browser.");
        }

        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) {
            throw new Error("No appropriate GPUAdapter found.");
        }

        const device = await adapter.requestDevice();


        const context  = canvas.getContext("webgpu") as GPUCanvasContext | null;
        if (!context) {
            throw new Error("Could not get a webgpu context (Should fall back onto webGL instance) ")
        }
        const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
        context.configure({
            device: device,
            format: canvasFormat,
        });

        const encoder = device.createCommandEncoder();
       

        const vertices = new Float32Array([
            -1.0,  -1.0, 
            1.0,   -1.0,
            1.0,   1.0,
            -1.0,  1.0,
        ]);
        const indices = new Uint32Array([
            0, 1, 2, 0, 2, 3
        ])

        const vertexBuffer = device.createBuffer({
            label: "Cell vertices",
            size: vertices.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
        })

        const indexBuffer = device.createBuffer({
            label: "Index buffer",
            size: indices.byteLength,
            usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
        })

        const uniformBuffer = device.createBuffer({
            size: 2 * 4, // 2 4 byte floats
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

               device.queue.writeBuffer(vertexBuffer, /*bufferOffset=*/0, vertices);
        device.queue.writeBuffer(indexBuffer, 0, indices );

        const vertexBufferLayout: GPUVertexBufferLayout = {
            arrayStride: 8, // in bytes
            attributes: [{
                format: "float32x2",
                offset: 0,
                shaderLocation: 0,
            }]
        }

      

        const cellShaderModule = device.createShaderModule({
            label: "Square shader",
            code:  triangleShader
            
        });

        const cellPipeline = device.createRenderPipeline({
        label: "Cell pipeline",
        layout: "auto",
        vertex: {
            module: cellShaderModule,
            entryPoint: "vertexMain",
            buffers: [vertexBufferLayout]
        },
        fragment: {
            module: cellShaderModule,
            entryPoint: "fragmentMain",
            targets: [{
         format: canvasFormat
            }]
        }
    });

    const bindGroup = device.createBindGroup({
            layout: cellPipeline.getBindGroupLayout(0),
            entries: [
                {binding: 0, resource: uniformBuffer},
            ],
        })
    
    const uniformValues = new Float32Array(2); 
    uniformValues.set([canvas.width, canvas.height], 0)


    device.queue.writeBuffer(uniformBuffer, 0, uniformValues)



     const pass = encoder.beginRenderPass({
            colorAttachments: [{
                view: context.getCurrentTexture().createView(),
                loadOp: "clear",
                clearValue: {r: 1, g: 0, b: 0, a: 1},
                storeOp: "store"
            }]
        });

        // After encoder.beginRenderPass()

        pass.setPipeline(cellPipeline);
        pass.setVertexBuffer(0, vertexBuffer);
        pass.setIndexBuffer(indexBuffer, "uint32");
        pass.setBindGroup(0, bindGroup)

        pass.drawIndexed(6); // 4 vertices

        pass.end();

        device.queue.submit([encoder.finish()]);


}


main();