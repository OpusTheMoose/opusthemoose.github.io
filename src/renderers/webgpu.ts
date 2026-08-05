import {type IRenderer} from "../IRenderer";

import triangleShader from "../../shaders/webgpu/square.wgsl?raw";


export class WebGPURenderer implements IRenderer {
    private encoder! : GPUCommandEncoder
    private device! : GPUDevice
    private context! : GPUCanvasContext
    private vertexBuffer! : GPUBuffer
    private indexBuffer! : GPUBuffer
    private renderPipeline! : GPURenderPipeline
    private backgroundBindGroup! : GPUBindGroup
    private uniformBuffer! : GPUBuffer


    async init(canvas: HTMLCanvasElement){
    const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) {
            throw new Error("No appropriate GPUAdapter found.");
        }


        this.device = await adapter.requestDevice();

        var context = canvas.getContext("webgpu") as GPUCanvasContext | null;
        if (context == null)
        {
            console.log("Failed to init WebGPU backend!");
            return
        }
        this.context = context

        const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
        context.configure({
            device: this.device,
            format: canvasFormat,
        });

        this.encoder = this.device.createCommandEncoder();
       

        const vertices = new Float32Array([
            -1.0,  -1.0, 
            1.0,   -1.0,
            1.0,   1.0,
            -1.0,  1.0,
        ]);
        const indices = new Uint32Array([
            0, 1, 2, 0, 2, 3
        ])

        this.vertexBuffer = this.device.createBuffer({
            label: "Cell vertices",
            size: vertices.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
        })

        this.indexBuffer = this.device.createBuffer({
            label: "Index buffer",
            size: indices.byteLength,
            usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
        })

        this.uniformBuffer = this.device.createBuffer({
            size: 2 * 4, // 2 4 byte floats
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        this.device.queue.writeBuffer(this.vertexBuffer, /*bufferOffset=*/0, vertices);
        this.device.queue.writeBuffer(this.indexBuffer, 0, indices );

        const vertexBufferLayout: GPUVertexBufferLayout = {
            arrayStride: 8, // in bytes
            attributes: [{
                format: "float32x2",
                offset: 0,
                shaderLocation: 0,
            }]
        }

        const cellShaderModule = this.device.createShaderModule({
            label: "Square shader",
            code:  triangleShader
            
        });

        this.renderPipeline = this.device.createRenderPipeline({
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

    this.backgroundBindGroup = this.device.createBindGroup({
            layout: this.renderPipeline.getBindGroupLayout(0),
            entries: [
                {binding: 0, resource: this.uniformBuffer},
            ],
        })
    
    const uniformValues = new Float32Array(2); 
    uniformValues.set([canvas.width, canvas.height], 0)


    this.device.queue.writeBuffer(this.uniformBuffer, 0, uniformValues)
    this.drawFrame()


    }

    drawFrame(): void {

     const pass = this.encoder.beginRenderPass({
            colorAttachments: [{
                view: this.context.getCurrentTexture().createView(),
                loadOp: "clear",
                clearValue: {r: 1, g: 0, b: 0, a: 1},
                storeOp: "store"
            }]
        });

        // After encoder.beginRenderPass()

        pass.setPipeline(this.renderPipeline);
        pass.setVertexBuffer(0, this.vertexBuffer);
        pass.setIndexBuffer(this.indexBuffer, "uint32");
        pass.setBindGroup(0, this.backgroundBindGroup)

        pass.drawIndexed(6); // 4 vertices

        pass.end();

        this.device.queue.submit([this.encoder.finish()]);


        return
    }
    resize(width: number, height: number): void { 
        const uniformValues = new Float32Array(2); 
        uniformValues.set([width, height], 0)


        this.device.queue.writeBuffer(this.uniformBuffer, 0, uniformValues)
        this.drawFrame()    
    }
}