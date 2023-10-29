import { fabric } from 'fabric'
import ShortUniqueId from 'short-unique-id'
const uid = new ShortUniqueId({ length: 8 })
export const RADIUS = 3
export const MINIMUM_GAP = 5
export interface AddEventOptions {}

export interface RemoveEventOptions {}

export interface ConnectEventOptions {}

export interface DisConnectEventOptions {}

export interface ComponentSchema {
  id: string
  booleanFunction: string // 'A&B' or 'A|B' or 'A^B' or 'A' or very complex boolean function (!A&B)|(C&D)
  inputs: { label?: string; id: string }[] // id[]
  outputs: { label?: string; id: string }[] // id[]
  x: number
  y: number
  label: string
}

export interface InputSchema {
  id: string
  x: number
  y: number
  label: string
  value: 0 | 1 | 'X'
}

export interface WireSchema {
  id: string
  from: string
  to: string
}
class LogicBoard {
  canvas: fabric.Canvas
  objectsMap: Map<string, fabric.Object>
  board: (ComponentSchema | InputSchema | WireSchema)[] = []

  constructor(canvas: fabric.Canvas, objectsMap?: Map<string, fabric.Object>) {
    this.canvas = canvas
    this.objectsMap = objectsMap || new Map()
  }

  add = (params: ComponentSchema | InputSchema) => {
    this.board.push(params)
    if ('booleanFunction' in params) {
      // inputs
      const inputs = params.inputs.map((input) => {
        const obj: { label?: fabric.Text; circle: fabric.Circle } = {} as any
        if (input.label) {
          const labelText = new fabric.Text(input.label, {
            fill: 'white',
            originX: 'center',
            originY: 'center',
            fontSize: 16,
            hasControls: false
          })
          obj['label'] = labelText
        }

        const circle = new fabric.Circle({
          radius: RADIUS,
          fill: 'white',
          originX: 'center',
          originY: 'center',
          hasControls: false,
          data: {
            id: input.id,
            type: 'input',
            parent: params.id
          }
        })

        obj['circle'] = circle
        return obj
      })
      const noInputs = params.inputs.length
      const noOutputs = params.outputs.length

      const outputs = params.outputs.map((output) => {
        const obj: { label?: fabric.Text; circle: fabric.Circle } = {} as any
        if (output.label) {
          const labelText = new fabric.Text(output.label, {
            fill: 'white',
            originX: 'center',
            originY: 'center',
            fontSize: 16,
            hasControls: false
          })
          obj['label'] = labelText
        }

        const circle = new fabric.Circle({
          radius: RADIUS,
          fill: 'white',
          originX: 'center',
          originY: 'center',
          hasControls: false,
          data: {
            id: output.id,
            type: 'output',
            parent: params.id
          }
        })

        obj['circle'] = circle
        return obj
      })

      const padding = Math.max(
        ...inputs.map((input) => input.label?.width || 0),
        ...outputs.map((output) => output.label?.width || 0)
      )

      const labelText = new fabric.Text(params.label, {
        fill: 'white',
        originX: 'center',
        originY: 'center',
        fontSize: 20
      })
      const labelBox = new fabric.Rect({
        width: labelText.width! + +20 + padding,
        height: Math.max(
          params.inputs.length * (RADIUS + MINIMUM_GAP * 2) * 2,
          labelText.height! + 20
        ),
        originX: 'center',
        originY: 'center',
        fill: 'black'
      })

      const master = new fabric.Group([labelBox, labelText], {
        left: params.x,
        top: params.y,
        hasControls: false,
        data: params
      })

      this.canvas.add(master)

      this.objectsMap.set(params.id, master)

      // inputs and outputs
      for (let i = 0; i < noInputs; i++) {
        let obj
        const input = inputs[i]
        const circle = input.circle
        const label = input.label
        circle.left = master.left! - master.width! / 2
        circle.top =
          master.top! -
          master.height! / 2 +
          ((i + 1) * master.height!) / (noInputs + 1)

        if (label) {
          label.left = circle.left! + label.width! + 5
          label.top = circle.top!
          obj = new fabric.Group([circle, label], {
            hasControls: false,
            data: circle.data,
            lockMovementX: true,
            lockMovementY: true
          })
        }

        this.objectsMap.set(params.inputs[i].id, obj || circle)
        this.canvas.add(obj || circle)
      }

      for (let i = 0; i < noOutputs; i++) {
        let obj
        const output = outputs[i]
        const circle = output.circle
        const label = output.label
        circle.left = master.left! + master.width! / 2
        circle.top =
          master.top! -
          master.height! / 2 +
          ((i + 1) * master.height!) / (noOutputs + 1)

        if (label) {
          label.left = circle.left! - label.width! - 5
          label.top = circle.top!
          obj = new fabric.Group([circle, label], {
            hasControls: false,
            data: circle.data,
            lockMovementX: true,
            lockMovementY: true
          })
        }

        this.objectsMap.set(params.outputs[i].id, obj || circle)
        this.canvas.add(obj || circle)
      }

      master.on('moving', (e) => {
        const target = e.target as fabric.Group
        const data = target.data as ComponentSchema
        const inputs = data.inputs
        const outputs = data.outputs
        const noInputs = inputs.length
        const noOutputs = outputs.length

        for (let i = 0; i < noInputs; i++) {
          const input = inputs[i]
          const circle = this.objectsMap.get(input.id) as fabric.Circle
          circle.left = target.left! - target.width! / 2
          circle.top =
            target.top! -
            target.height! / 2 +
            ((i + 1) * target.height!) / (noInputs + 1)
          // this.canvas.renderAll()
        }

        for (let i = 0; i < noOutputs; i++) {
          const output = outputs[i]
          const circle = this.objectsMap.get(output.id) as fabric.Circle
          circle.left = target.left! + target.width! / 2
          circle.top =
            target.top! -
            target.height! / 2 +
            ((i + 1) * target.height!) / (noOutputs + 1)
          // this.canvas.renderAll()
        }
      })
    } else {
    }
  }

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
