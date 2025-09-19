import runHistory from './lineage.js'
import createTreeChart from './createTreeChart.js'
import { flattenTree } from './utils'

const { familyTree, eventsByYear } = runHistory(445)

const eventsList = document.getElementById('events')

eventsByYear.forEach((events, year) => {
  if(events.length > 0){
    const yearLabel = document.createElement('b')
    yearLabel.textContent = `Year ${year}`
    eventsList.appendChild(yearLabel)

    events.forEach(event => {
      const eventEntry = document.createElement('p')
      eventEntry.textContent = event
      eventsList.appendChild(eventEntry)
    })
  }
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
