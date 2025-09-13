import runHistory from './lineage.js'
import createTreeChart from './createTreeChart.js'

const { familyTree, events, allPeople } = runHistory(445)

const eventsList = document.createElement('div')
events.forEach(event => {
  const element = document.createElement('p')
  element.textContent = event
  eventsList.appendChild(element)
})

document.getElementById('container')
  .appendChild(createTreeChart(familyTree))

document.getElementById('container')
  .appendChild(eventsList)
