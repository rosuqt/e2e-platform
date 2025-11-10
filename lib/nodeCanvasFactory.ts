// lib/nodeCanvasFactory.ts
import { Canvas, createCanvas } from "canvas"

export default class NodeCanvasFactory {
  create(width: number, height: number) {
    const canvas = createCanvas(width, height)
    const context = canvas.getContext("2d")
    return { canvas, context, width, height }
  }

  reset(canvasAndCtx: any, width: number, height: number) {
    canvasAndCtx.canvas.width = width
    canvasAndCtx.canvas.height = height
    canvasAndCtx.width = width
    canvasAndCtx.height = height
  }

  destroy(canvasAndCtx: any) {
    // nothing special to do for node-canvas
    canvasAndCtx.canvas.width = 0
    canvasAndCtx.canvas.height = 0
  }
}
