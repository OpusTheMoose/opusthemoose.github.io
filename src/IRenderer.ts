export interface IRenderer {
    init(canvas: HTMLCanvasElement, context : GPUCanvasContext): Promise<void>
}