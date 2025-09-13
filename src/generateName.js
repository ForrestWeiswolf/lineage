const { pick, romanize } = require('./utils')
const { Format, WeightedRandom } = require('meristem')

const v = new WeightedRandom({
  'a': 7,
  'e': 6,
  'i': 6,
  'u': 2,
  'o': 2
})

const ic = new WeightedRandom({
  'p': 1,
  't': 1,
  'k': 3,
  'b': 1,
  'd': 2,
  'g': 1,
  'f': 1,
  // 's': 1,
  'sh': 2,
  'x': 6,
  'v': 1,
  // 'z': 1,
  'j': 1,
  'gh': 2,
  'n': 2,
  'm': 1,
  'r': 6,
})

const fc = new WeightedRandom({
  'sh': 4,
  'x': 3,
  'n': 2,
  'm': 1,
  'r': 3,
  'v': 1,
  // 'z': 1,
  'j': 1,
})


const initial = new WeightedRandom({
  '(ic)': 9,
  '': 1
})


const final = new WeightedRandom({
  '(fc)': 2,
  '': 4
})

const word = new Format('(syl)(end)', {
  syl: '(initial)(v)(final)',
  end: new WeightedRandom(['(syl)', 3], ['', 1]),
  initial, final, v, ic, fc
})

const generateWord = () => {
  return word.expand()
    .replace('xs', 's')
    .replace('x', 'kh')
    .replace('shsh', 'sh')
    .replace('khkh', 'sh')
    .replace(/([aeiou])([^aeiou])([aeiou])/, '$1$2$2$3')
    .replace(/([aeiou]){2}/, '$1\'$1')
}

const generateName = (sex, notables, allPeople) => {
  if (Math.random() < 0.3) {
    const uncased = generateWord()
    if (uncased.length < 3) {
      return generateName(sex, notables, allPeople)
    }
    return uncased[0].toUpperCase() + uncased.split('').splice(1).join('')
  } else {
    const namesake = pick(notables
      .filter(
        n => n.sex === sex
          && !allPeople.find(p => p.shortName() === n.shortName() && p.alive)
      )
    )
    if (namesake) {
      namesake.namedAfter = namesake.namedAfter || 0
      namesake.namedAfter++
      return `${namesake.shortName()} ${romanize(namesake.namedAfter + 1)}`
    }
    return generateName(sex, notables, allPeople)
  }
}

module.exports = generateName