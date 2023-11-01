import ShortUniqueId from 'short-unique-id'

export const SIDEBAR_WIDTH = 250
export const TOGGLE_SIDEBAR_WIDTH = 8
export const NAVBAR_HEIGHT = 64
const colorDictionary = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F'
]
// or using default dictionaries available since v4.3+

const uid = new ShortUniqueId({ dictionary: colorDictionary })

// then taste the rainbow 🌈

export const RANDOM_MOUSE_COLOR = '#' + uid.randomUUID(6)
