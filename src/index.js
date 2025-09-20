import runHistory from './lineage.js'
import createTreeChart from './createTreeChart.js'
import populateInfoContainer from './populateInfoContainer.js'

const HISTORY_LENGTH = 445
const { familyTree, eventsByYear } = runHistory(HISTORY_LENGTH)

const displayFamilyTree = (tree) => {
  document.getElementById('tree-container').innerHTML = ''
  document.getElementById('tree-container')
    .appendChild(createTreeChart(tree))
}

populateInfoContainer(eventsByYear, familyTree)
displayFamilyTree(familyTree)
