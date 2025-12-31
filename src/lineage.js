import Person from './Person'
import { traverseTree, flattenTree } from './utils'

const getMonarch = (tree) => {
  let monarch = null
  traverseTree(tree, person => {
    if (person.isMonarch && person.alive) {
      monarch = person
    }
  })
  return monarch
}

export const getLineOfSuccession = (monarch) => {
  console.log({ monarch })
  let los = [monarch]
  let i = 0
  while (i < los.length) {
    console.log(los, i)
    los.push(...los[i].children.filter(p => !los.includes(p)))
    if (los[i]?.parent !== null && !los.includes(los[i].parent)) {
      los.push(los[i].parent)
    }
    i++
  }

  return los.filter(
    potentialSuccessor => potentialSuccessor.alive && potentialSuccessor.circle() >= 5 && potentialSuccessor !== monarch
  )
}

const runHistory = ((settings) => {
  const events = []

  let root = new Person(null,
    0,
    "Rokhana Stonesong",
    'F',
    (1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10 + 11 + 12 + 13 + 14) * 1000,
    false,
    130, [], false, true, 16
  )

  root.children.push(new Person(root,
    9,
    "Ishvu Goldcrowned",
    'F',
    (1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10 + 11 + 12 + 13 + 14 + 15) * 1000,
    true,
    40, [], true, true, 17
  ))

  let stateByYear = [root]
  let eventsByYear = []

  for (let i = 0; i < settings.historyLength; i++) {
    stateByYear.push(root)
    eventsByYear.push([])

    root = root.update(eventsByYear[eventsByYear.length - 1], root, settings)

    if (!getMonarch(root)) {
      const prevMonarch = getMonarch(stateByYear[stateByYear.length - 1])
      if (prevMonarch) {
        const los = getLineOfSuccession(prevMonarch)
        const newMonarchName = los[0] && los[0].name
        if (newMonarchName) {
          traverseTree(root, person => {
            if (person.name === newMonarchName) {
              person.isMonarch = true
              eventsByYear[eventsByYear.length - 1].push(`${person.titledName()} inherited the throne. Current line of succession: ${getLineOfSuccession(person).join(', ')}`)
            }
          })
        }

        if (prevMonarch && !newMonarchName) {
          eventsByYear[eventsByYear.length - 1].push('There was a succession crisis!')
        }
      }
    }
  }

  return { eventsByYear, stateByYear }
})

export default runHistory