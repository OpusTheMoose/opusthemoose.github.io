import { type IRenderer } from "../IRenderer";
import bgVertSource from "../../shaders/webgl/background.vert?raw";
import bgFragSource from "../../shaders/webgl/background.frag?raw";



export class WebGLRenderer implements IRenderer{
    private gl! : WebGL2RenderingContext

    async init(canvas: HTMLCanvasElement)  {
        var context = canvas.getContext("webgl2") as WebGL2RenderingContext | null;
        if (context == null)
        {
            console.log("Failed to init Webgl2 backend!");
            return
        }
        this.gl = context
        this.gl.SHADER_TYPE

        // load the background design
        const vertShader = this.loadShader(this.gl.VERTEX_SHADER, bgVertSource)
        const fragShader = this.loadShader(this.gl.FRAGMENT_SHADER, bgFragSource)

        const shaderProgram = this.gl.createProgram();
        this.gl.attachShader(shaderProgram, vertShader);
        this.gl.attachShader(shaderProgram, fragShader);
        this.gl.linkProgram(shaderProgram)

        if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS))
        {
            throw new Error(`Unable to initalize shader program: ${this.gl.getProgramInfoLog(shaderProgram)}`)
        }
        const programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: this.gl.getAttribLocation(shaderProgram, "aPos"),
            },
            uniformLocations: {
                dim: this.gl.getUniformLocation(shaderProgram, "dim")
            }
        }
        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

        const positions = [
            1.0, 1.0,
           -1.0, 1.0,
            1.0, -1.0,
            -1.0, -1.0
        ]

        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW)
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer)
        this.gl.vertexAttribPointer(
            0, 2, this.gl.FLOAT, false, 0, 0
        );
        this.gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition)


        

        this.gl.clearColor(1, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.gl.useProgram(programInfo.program)
        this.gl.uniform2fv(programInfo.uniformLocations.dim, new Float32Array([canvas.width, canvas.height]))
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4)

        
        
    }
    private loadShader(type: number, source: string ): WebGLShader {
        const shader = this.gl.createShader(type);
        if (shader == null){
            throw new Error ("Failed to create shader");
        }

        this.gl.shaderSource(shader, source );
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            this.gl.deleteShader(shader)
            throw new Error(`Failed to compile shader: ${this.gl.getShaderInfoLog(shader)} `)
        }
        return shader
    }
    async drawFrame() {
        return
    }
}