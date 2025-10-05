import { Format, WeightedRandom } from 'meristem'
import { pick, romanize, flattenTree } from './utils'

const hasOnlyNumericValues = (obj) => Object.values(obj).every(val => typeof val === 'number')

const parseDefinitionsObject = (obj) => {
  const result = {}
  Object.entries(obj).map(([key, val]) => {
    if (typeof val === 'object' && hasOnlyNumericValues(val)) {
      result[key] = new WeightedRandom(val)
    } else {
      result[key] = val
    }
  })

  return result
}

const definitions = {
  v: {
    'a': 7, 'e': 6, 'i': 6, 'u': 2, 'o': 2
  },
  ic: {
    'p': 1, 't': 1, 'k': 3,
    'b': 1, 'd': 2, 'g': 1,
    'f': 1, 'sh': 2, 'x': 6,
    'v': 1, 'j': 1, 'gh': 2,
    'n': 2, 'm': 1,
    'r': 6,
  },
  fc: {
    'sh': 4, 'x': 3,
    'v': 1, 'j': 1,
    'n': 2, 'm': 1,
    'r': 3,
  },
  initial: { '(ic)': 9, '': 1 },
  final: { '(fc)': 2, '': 4 },
  syl: '(initial)(v)(final)',
  end: { '(syl)': 3, '': 1 },
}

const word = new Format('(syl)(end)', parseDefinitionsObject(definitions))


const generateWord = () => {
  return word.expand()
    .replaceAll(/xs/g, 's')
    .replaceAll(/x/g, 'kh')
    .replaceAll(/shsh/g, 'sh')
    .replaceAll(/[jzf]sh/g, 'sh')
    .replaceAll(/khkh/g, 'kh')
    .replaceAll(/([aeiou])([^aeiou])([aeiou])/g, '$1$2$2$3')
    .replaceAll(/([aeiou]){2}/g, '$1\'$1')
    .replaceAll(/e$/g, '')
}

const getNamesakes = (tree) => flattenTree(tree).filter(p => p.level() >= 16 || p.circle >= 7 || p.isMonarch)

const generateName = (sex, tree) => {
  if (Math.random() < 0.3) {
    const uncased = generateWord()
    if (uncased.length < 3) {
      return generateName(sex, tree)
    }
    return uncased[0].toUpperCase() + uncased.split('').splice(1).join('')
  } else {
    const namesake = pick(getNamesakes(tree)
      .filter(
        n => n.sex === sex
          && !flattenTree(tree).find(p => p.shortName() === n.shortName() && p.alive)
      )
    )
    if (namesake) {
      namesake.namedAfter = namesake.namedAfter || 0
      namesake.namedAfter++
      return `${namesake.shortName()} ${romanize(namesake.namedAfter + 1)}`
    }
    return generateName(sex, tree)
  }
}

export default generateName