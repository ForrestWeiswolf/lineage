import Person from './Person'
import { traverseTree } from './utils'

const getMonarch = (tree) => {
  let monarch = null
  traverseTree(tree, person => {
    if (person.isMonarch && person.alive) {
      monarch = person
    }
  })
  return monarch
}

const getLineOfSuccession = (monarch) => {
  let los = []
  let current = monarch
  while (current && current.children) {
    los = [...los, ...current.children]
    current = current.parent
  }

  return los.filter(
    potentialSuccessor => potentialSuccessor.alive && potentialSuccessor.circle() >= 5 && potentialSuccessor !== monarch
  )
}

const runHistory = (years => {
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

  for (let i = 0; i < years; i++) {
    stateByYear.push(root)
    eventsByYear.push([])

    root = root.update(eventsByYear[eventsByYear.length - 1], root)

    if (!getMonarch(root)) {
      const prevMonarch = getMonarch(stateByYear[stateByYear.length - 1])
      const los = getLineOfSuccession(prevMonarch)
      const newMonarchName = los[0] && los[0].name
      if (newMonarchName) {
        traverseTree(root, person => {
          if (person.name === newMonarchName) {
            person.isMonarch = true
            events.push(`${person.title()} ${person.name} inherited the throne`)
          }
        })
      }

      if(prevMonarch && !newMonarchName){
        events.push('There was a succession crisis!')
      }
    }
  }

  return { eventsByYear, familyTree: root.children[0] }
})

export default runHistory