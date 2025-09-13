import runHistory from './lineage.js'

const { events, allPeople, tree } = runHistory(445)

const element = document.createElement('div')
element.innerHTML = events.join('\n')

document.body.appendChild(element)