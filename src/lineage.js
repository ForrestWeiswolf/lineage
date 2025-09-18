import generateName from './generateName'
import { flattenTree } from './utils'

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
    return `${this.title()} ${this.name} (${this.infoString()})`
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
}

const getLineOfSuccession = (monarch) => {
  let los = []
  let current = monarch
  while (current && current.children) {
    los = [...los, ...current.children]
    current = current.parent
  }

  return los.filter(
    potentialSuccessor => potentialSuccessor.alive && potentialSuccessor.circle() >= 5
  )
}

const runHistory = (years => {
  const events = []

  const root = new Person(null,
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

  const updatePerson = (p, year) => {
    p.age += 1
    if (p.willMarry()) {
      p.married = true
      events.push(`In year ${year}, ${p.title()} ${p.name} got married at age ${p.age}`)
    }

    if (p.married && (Math.random() < Math.pow(p.age / (200 + p.circleMax * 10), 15))) {
      p.married = false
      events.push(`In year ${year}, ${p.title()} ${p.name}'s spouse died`)
    }

    if (p.willDie()) {
      p.alive = false
      events.push(`In year ${year}, ${p.toString()} died`)

      if (p.isMonarch) {
        let los = getLineOfSuccession(p)
        const monarch = los[0]
        if (monarch) {
          monarch.isMonarch = true
          events.push(`${monarch.title()} ${monarch.name} inherited the throne`)
        } else {
          events.push('There was a succession crisis!')
        }
      }
    }

    if (p.willHaveChild()) {
      const childCircleMax = Math.random > 0.85 ? p.circleMax - 2 : p.circleMax - 1
      const sex = Math.random() < 0.5 ? 'M' : 'F'
      const child = new Person(p, Math.max(childCircleMax, 0), generateName(sex, root), sex)
      p.children.push(child)
      events.push(`In year ${year}, ${p.toString()} had a child: ${child.name}`)
    }

    if (p.level() < p.maxLevel) {
      p.xp += Math.min(p.age / 100, 0.01) * 360
      p.xp += p.circleMax / 10 * 360
      p.xp += p.maxLevel + (p?.parent?.level ? p.parent.level() : 20)
      if (p.parent?.isMonarch) {
        p.xp += 100
      }
    }
  }

  for (let i = 0; i < years; i++) {
    flattenTree(root)
      .filter(p => p.alive)
      .forEach(p => updatePerson(p, i))
  }

  return { events, familyTree: root.children[0] }
})

export default runHistory