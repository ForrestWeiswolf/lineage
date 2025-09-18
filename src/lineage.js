import generateName from './generateName'
import { traverseTree } from './utils'

class Person {
  constructor(
    parent,
    circleMax,
    name,
    sex,
    xp = 1,
    isMonarch = false,
    age = 0,
    children = [],
    married = false,
    alive = true,
    maxLevel = Math.max(Math.min(Math.ceil(Math.pow(Math.random(), 1.8) * 17) + circleMax, 20), 3)
  ) {
    this.parent = parent
    this.circleMax = circleMax
    this.name = name
    this.xp = xp
    this.age = age
    this.children = children
    this.married = married
    this.alive = alive
    this.sex = sex
    this.isMonarch = isMonarch
    this.maxLevel = maxLevel
  }

  title() {
    if (!this.parent) {
      return null
    } else if (this.isMonarch) {
      return this.sex === 'M' ? 'King' : 'Queen'
    } else if (this.parent.isMonarch || this.circle() >= 5) {
      return this.sex === 'M' ? 'Prince' : 'Princess'
    } else {
      return this.sex === 'M' ? 'Lord' : 'Lady'
    }
  }

  shortName() {
    return this.name.split(' ')[0]
  }

  level() {
    let xp = this.xp
    let lvl = 0

    while (xp > lvl * 1000) {
      xp -= lvl * 1000
      lvl++
    }

    return lvl
  }

  circle() {
    return Math.min(this.circleMax, Math.floor(this.level() / 2))
  }

  infoString() {
    return `age ${this.age}, circle ${this.circle()}, lvl ${this.level()}, max circle ${this.circleMax}`
  }

  toString() {
    return `${this.title() ? this.title() + ' ' : ''}${this.name} (${this.infoString()})`
  }

  willMarry() {
    return !this.married && this.age > 30 && this.age < 180 && (
      (this.children.length === 0 && Math.random() < 0.2)
      || (this.children.length !== 0 && Math.random() < 0.01)
    )
  }

  willDie() {
    return Math.random() < Math.pow(this.age / (200 + this.circleMax * 10), 15)
      && (!this.isMonarch || Math.random() < .5)
  }

  willHaveChild() {
    return this.married
      && (this.age < (this.sex === 'M' ? 160 : 120))
      && (Math.random() > (this.age / (180))) && (Math.random() > 0.96)
      && (Math.random() > (this.children.length / 10))
  }

  update(year, events, root) {
    let { married, alive, xp, age } = this
    let children = this.children.map(child => child.update(year, events, root))
    if (this.alive) {
      age += 1

      if (this.willMarry()) {
        married = true
        events.push(`In year ${year}, ${this.title()} ${this.name} got married at age ${this.age}`)
      }

      if (this.married && (Math.random() < Math.pow(this.age / (200 + this.circleMax * 10), 15))) {
        married = false
        events.push(`In year ${year}, ${this.title()} ${this.name}'s spouse died`)
      }

      if (this.willDie()) {
        alive = false
        events.push(`In year ${year}, ${this.toString()} died`)
      }

      if (this.willHaveChild()) {
        const childCircleMax = Math.random > 0.85 ? this.circleMax - 2 : this.circleMax - 1
        const sex = Math.random() < 0.5 ? 'M' : 'F'
        const child = new Person(this, Math.max(childCircleMax, 0), generateName(sex, root), sex)
        children.push(child)
        events.push(`In year ${year}, ${this.toString()} had a child: ${child.name}`)
      }

      if (this.level() < this.maxLevel) {
        xp += Math.min(this.age / 100, 0.01) * 360
        xp += this.circleMax / 10 * 360
        xp += this.maxLevel + (this?.parent?.level ? this.parent.level() : 20)
        if (this.parent?.isMonarch) {
          xp += 100
        }
      }
    }

    const updated = new Person(this.parent, this.circleMax, this.name, this.sex,
      xp,
      this.isMonarch,
      age,
      children,
      married,
      alive,
      this.maxLevel
    )

    updated.children.forEach(c => c.parent = updated)
    return updated
  }
}

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

  for (let i = 0; i < years; i++) {
    stateByYear.push(root)

    root = root.update(i, events, root)

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

  return { events, familyTree: root.children[0] }
})

export default runHistory