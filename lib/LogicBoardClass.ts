class LogicBoard {
  canvas: fabric.Canvas
  objectsMap: Map<string, fabric.Object>

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas
    this.objectsMap = new Map()
  }

  add = (object: fabric.Object) => {
    this.canvas.add(object)
    const id = this.objectsMap.set(object.id!, object)
  }
}

class PrimitiveGate {
  constructor() {}
}

class ANDGate extends PrimitiveGate {
  noInputs: number
  x: number
  y: number
  inputs: any[]
  constructor(noInputs: number, x: number, y: number) {
    super()
    this.noInputs = noInputs
    this.inputs = Array(noInputs).fill('X')
    this.x = x
    this.y = y
  }
}

export default LogicBoard
