export interface IRenderer {
    init(canvas: HTMLCanvasElement): Promise<void>
    resize(width: number, height: number): void
    drawFrame() : void
}