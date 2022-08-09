export const stepsNames: {
  [key: string]: number[]
} = {
  Sybil: [-4],
  Suspicious: [-3, -2, -1],
  'Bad Vibes': [-0.5],
  Neutral: [0],
  'Good Vibes': [0.5],
  Honest: [1, 2, 3, 4],
}

export const stepsValues: {
  [key: string]: number
} = {
  '-5': -4,
  '-4': -3,
  '-3': -2,
  '-2': -1,
  '-1': -0.5,
  0: 0,
  1: 0.5,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
}

// reverse stepsValues
export const valueToStep = Object.keys(stepsValues).reduce(
  (
    ret: {
      [key: number]: string
    },
    key
  ) => {
    ret[stepsValues[key]] = key
    return ret
  },
  {}
)

export function getStepValue(step: string | number) {
  return +stepsValues[step]
}

export function getStepName(percents: number) {
  return Object.keys(stepsNames).find(key => stepsNames[key].includes(percents))
}
