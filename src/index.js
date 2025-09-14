import runHistory from './lineage.js'
import createTreeChart from './createTreeChart.js'
import { flattenTree } from './utils'

const { familyTree, events } = runHistory(445)

const eventsList = document.getElementById('events')

events.forEach(event => {
  const element = document.createElement('p')
  element.textContent = event
  eventsList.appendChild(element)
})

const livingList = document.getElementById('living-people')
flattenTree(familyTree)
  .filter(p => p.alive)
  .sort((a, b) => a.isMonarch ? -Infinity : b.circle() - a.circle())
  .forEach(person => {
    const element = document.createElement('p')
    element.textContent = person.toString()
    livingList.appendChild(element)
  })

document.getElementById('tree-container')
  .appendChild(createTreeChart(familyTree))

document.getElementById('info-container')
  .appendChild(eventsList)

document.getElementById('info-container')
  .appendChild(livingList)
