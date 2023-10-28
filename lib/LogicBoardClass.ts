import { fabric } from 'fabric'
import ShortUniqueId from 'short-unique-id'
const uid = new ShortUniqueId({ length: 8 })

export interface AddEventOptions {}

export interface RemoveEventOptions {}

export interface ConnectEventOptions {}

export interface DisConnectEventOptions {}

export interface ObjectSchema<T extends 'component' | 'wire'> {
  id: string
  booleanFunction: string // 'A&B' or 'A|B' or 'A^B' or 'A' or very complex boolean function (!A&B)|(C&D)
  inputs: { label?: string; id: string }[] // id[]
  outputs: { label?: string; id: string }[] // id[]
  x: number
  y: number
  label: string
}

class LogicBoard {
  canvas: fabric.Canvas
  objectsMap: Map<string, fabric.Object>

  constructor(canvas: fabric.Canvas, objectsMap?: Map<string, fabric.Object>) {
    this.canvas = canvas
    this.objectsMap = objectsMap || new Map()
  }

  add = (params: AddEventOptions) => {}

  remove = (params: RemoveEventOptions) => {}

  connect = (params: ConnectEventOptions) => {}

  disconnect = (params: DisConnectEventOptions) => {}
}

class PrimitiveGate {
  constructor() {}
}

export class ANDGate extends PrimitiveGate {
  noInputs: number = 2
  x: number
  y: number
  inputs: fabric.Object | 'X'[]
  outputs: 0 | 1 | 'X'[]
  id: string
  constructor(noInputs: number, x: number, y: number) {
    super()
    this.noInputs = noInputs
    this.inputs = Array(noInputs).fill('X')
    this.outputs = ['X']
    this.x = x
    this.y = y
    this.id = uid.rnd()
  }

  draw = (canvas: fabric.Canvas) => {
    const master = new fabric.IText('AND', {
      left: this.x,
      top: this.y,
      fontSize: 20,
      textAlign: 'center',
      fontFamily: 'monospace',
      hasControls: false,
      hasBorders: false,
      data: {
        id: this.id
      }
    })

    canvas.add(master)
  }
}

export default LogicBoard
