type Nodee = {
  booleanFunction: string | 0 | 1
  inputs: Nodee[] | null
}

export const evaluateBooleanFunction = (param: Nodee) => {
  return eval(getBooleanExpression(param))
}

export const getBooleanExpression = (param: Nodee) => {
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
