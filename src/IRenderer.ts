export interface IRenderer {
    init(canvas: HTMLCanvasElement): Promise<void>
    drawFrame() : void
}