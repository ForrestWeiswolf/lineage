import generateName from './generateName'

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
    if (this.isMonarch) {
      return this.sex === 'M' ? 'King' : 'Queen'
    } else if (this.parent.isMonarch || this.circle >= 5) {
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
    let lvl = 1
    while (xp > 0) {
      xp -= lvl * 1000
      lvl++
    }

    return lvl
  }

  circle() {
    return Math.min(this.circleMax, Math.floor(this.level() / 2))
  }

  infoString(){
    return `age ${this.age} , circle ${this.circle()}, lvl ${this.level()}, max circle ${this.circleMax}`
  }

  toString() {
    return `${this.title()} ${this.name} (${this.infoString()})`
  }
}

const runHistory = (years => {
  const allPeople = []
  const notables = []

  notables.push({ name: "Rokhana Stonesong", shortName: () => "Rokhana", level: () => 16, circleMax: 0, sex: 'F' })
  notables.push(
    new Person(notables[0],
      9,
      "Ishvu Goldcrowned",
      'F',
      (1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10 + 11 + 12 + 13 + 14 + 15) * 1000,
      true,
      40, [], true, true, 17
    )
  )

  allPeople.push(...notables)

  const events = []
  for (let i = 0; i < years; i++) {
    allPeople.filter(p => p.alive).forEach(p => {
      p.age += 1
      if (!p.married && p.age > 30 && p.age < 180) {
        if (
          (p.children.length === 0 && Math.random() < 0.2)
          || (p.children.length !== 0 && Math.random() < 0.01)
        ) {
          p.married = true
          events.push(`In year ${i}, ${p.title()} ${p.name} got married at age ${p.age}`)
        }
      }

      if (p.married && Math.random() < Math.pow(p.age / (180 + p.circleMax * 10), 10)) {
        p.married = false
        events.push(`In year ${i}, ${p.title()} ${p.name}'s spouse died`)
      }

      if (
        (Math.random() < Math.pow(p.age / (180 + p.circleMax * 10), 10))
        && (p.isMonarch && Math.random() < .5)
      ) {
        p.alive = false
        events.push(`In year ${i}, ${p.toString()}, died`)
        if (p.isMonarch) {
          let los = []
          let current = p
          while (current.children) {
            los = [...los, ...current.children]
            current = current.parent
          }

          const monarch = los.find(
            potentialSuccessor => potentialSuccessor.alive && potentialSuccessor.circle() >= 5
          )
          if (monarch) {
            monarch.isMonarch = true
            notables.push(monarch)
            events.push(`${monarch.title()} ${monarch.name} inherited the throne`)
          } else {
            events.push('There was a succession crisis!')
            events.push('Potential successors:' + los.filter(potentialSuccessor => potentialSuccessor.alive).map(p => p.toString()).join(', '))
          }
        }
      }

      if (p.married
        && (p.age < (p.sex === 'M' ? 160 : 120))
        && (Math.random() > (p.age / (180)))
        && (Math.random() > 0.96)
        && (Math.random() > (p.children.length / 10))
        // && (Math.random() * 10 > (p.circleMax / 10))
      ) {
        const childCircleMax = Math.random > 0.85 ? p.circleMax - 2 : p.circleMax - 1
        const sex = Math.random() < 0.5 ? 'M' : 'F'
        const child = new Person(p, Math.max(childCircleMax, 0), generateName(sex, notables, allPeople), sex)
        p.children.push(child)
        allPeople.push(child)
        events.push(`In year ${i}, ${p.toString()} had a child: ${child.name}`)
      }

      if (p.level() < p.maxLevel) {
        p.xp += Math.min(p.age / 100, 0.01) * 360
        p.xp += p.circleMax / 10 * 360
        p.xp += p.maxLevel + (p.parent.level ? p.parent.level() : 20)
        if (p.parent.isMonarch) {
          p.xp += 100
        }

        if (!notables.find(n => n.shortName() === p.shortName()) && (p.level() >= 16 || p.circle >= 7)) {
          notables.push(p)
        }
      }
    })
  }

  return { events, allPeople, familyTree: notables[1] }
})


export default runHistory