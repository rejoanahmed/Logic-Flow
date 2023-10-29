import { ComponentSchema, MINIMUM_GAP, RADIUS } from './LogicBoardClass'
import { fabric } from 'fabric'

type Nodee<T extends 'input' | 'composite'> = {
  booleanFunction: T extends 'composite' ? string : 0 | 1
  inputs: T extends 'composite' ? Nodee<'input' | 'composite'>[] : null
}

export const evaluateBooleanFunction = (
  param: Nodee<'input' | 'composite'>
) => {
  return eval(getBooleanExpression(param))
}

export const getBooleanExpression = (param: Nodee<'input' | 'composite'>) => {
  if (param.inputs === null) {
    return `${param.booleanFunction}`
  } else {
    let expression = param.booleanFunction as string
    for (let i = 0; i < param.inputs.length; i++) {
      const input = param.inputs[i]
      expression = expression.replaceAll(
        String.fromCharCode(65 + i),
        `${getBooleanExpression(input)}`
      )
    }
    return `(${expression})`
  }
}

export const addComponent = (
  params: ComponentSchema,
  canvas: fabric.Canvas,
  objectsMap: Map<string, fabric.Object>
) => {
  const noInputs = params.inputs.length
  const noOutputs = params.outputs.length

  const inputs = params.inputs.map((input) => {
    const obj: { label?: fabric.Text; circle: fabric.Circle } = {} as any
    if (input.label) {
      const labelText = new fabric.Text(input.label, {
        fill: 'white',
        originX: 'center',
        originY: 'center',
        fontSize: 12,
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
      hoverCursor: 'pointer',
      moveCursor: 'pointer',
      lockMovementX: true,
      lockMovementY: true,
      data: {
        id: input.id,
        type: 'input',
        parent: params.id
      }
    })

    obj['circle'] = circle
    return obj
  })

  const outputs = params.outputs.map((output) => {
    const obj: { label?: fabric.Text; circle: fabric.Circle } = {} as any
    if (output.label) {
      const labelText = new fabric.Text(output.label, {
        fill: 'white',
        originX: 'center',
        originY: 'center',
        fontSize: 12,
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
      hoverCursor: 'pointer',
      moveCursor: 'pointer',
      lockMovementX: true,
      lockMovementY: true,
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
    width: labelText.width! + 40 + padding,
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

  canvas.add(master)

  objectsMap.set(params.id, master)

  // inputs and outputs
  for (let i = 0; i < noInputs; i++) {
    const input = inputs[i]
    const circle = input.circle
    const label = input.label

    circle.left = master.left!
    circle.top = master.top! + ((i + 1) * master.height!) / (noInputs + 1)
    circle.setCoords()
    if (label) {
      label.set({
        left: circle.left! + RADIUS * 2 + MINIMUM_GAP,
        top: circle.top!,
        selectable: false,
        hasControls: false
      })
      canvas.add(label)
    }
    objectsMap.set(params.inputs[i].id, circle)
    canvas.add(circle)
  }

  for (let i = 0; i < noOutputs; i++) {
    const output = outputs[i]
    const circle = output.circle
    const label = output.label
    circle.left = master.left! + master.width!
    circle.top = master.top! + ((i + 1) * master.height!) / (noOutputs + 1)
    circle.setCoords()
    if (label) {
      label.left = circle.left! - (RADIUS * 2 + MINIMUM_GAP)
      label.top = circle.top!
      label.set({
        selectable: false,
        hasControls: false
      })
      canvas.add(label)
    }

    objectsMap.set(params.outputs[i].id, circle)
    canvas.add(circle)
  }

  master.on('moving', () => {
    // inputs and outputs
    for (let i = 0; i < noInputs; i++) {
      const input = inputs[i]
      const circle = input.circle
      const label = input.label
      circle.left = master.left!
      circle.top = master.top! + ((i + 1) * master.height!) / (noInputs + 1)
      circle.setCoords()
      if (label) {
        label.set({
          left: circle.left! + RADIUS * 2 + MINIMUM_GAP,
          top: circle.top!,
          selectable: false,
          hasControls: false
        })
      }
    }

    for (let i = 0; i < noOutputs; i++) {
      const output = outputs[i]
      const circle = output.circle
      const label = output.label
      circle.left = master.left! + master.width!
      circle.top = master.top! + ((i + 1) * master.height!) / (noOutputs + 1)
      circle.setCoords()
      if (label) {
        label.left = circle.left! - (RADIUS * 2 + MINIMUM_GAP)
        label.top = circle.top!
        label.set({
          selectable: false,
          hasControls: false
        })
      }
    }
  })
}
