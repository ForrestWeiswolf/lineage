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

  titledName() {
    if (!this.parent) {
      return this.name
    } else if (this.isMonarch) {
      return this.sex === 'M' ? `King ${this.name}` : `Queen ${this.name}`
    } else if (this.parent.isMonarch || this.circle() >= 5) {
      return this.sex === 'M' ? `Prince ${this.name}` : `Princess ${this.name}`
    } else {
      return this.sex === 'M' ? `Lord ${this.name}` : `Lady ${this.name}`
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
    return `${this.titledName()} (${this.infoString()})`
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

  update(events, root) {
    // Note: doesn't handle royal inheritance; that's done elsewhere

    let { married, alive, xp, age } = this
    let children = this.children.map(child => child.update(events, root))
    if (this.alive) {
      age += 1

      if (this.willMarry()) {
        married = true
        events.push(`${this.titledName()} got married at age ${this.age}`)
      }

      if (this.married && (Math.random() < Math.pow(this.age / (200 + this.circleMax * 10), 15))) {
        married = false
        events.push(`${this.titledName()}'s spouse died`)
      }

      if (this.willDie()) {
        alive = false
        events.push(`${this.toString()} died`)
      }

      if (this.willHaveChild()) {
        const childCircleMax = Math.random > 0.85 ? this.circleMax - 2 : this.circleMax - 1
        const sex = Math.random() < 0.5 ? 'M' : 'F'
        const child = new Person(this, Math.max(childCircleMax, 0), generateName(sex, root), sex)
        children.push(child)
        events.push(`${this.toString()} had a child: ${child.name}`)
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

export default Person
