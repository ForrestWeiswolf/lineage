import runHistory from './lineage.js'
import createTreeChart from './createTreeChart.js'
import populateInfoContainer from './populateInfoContainer.js'

const HISTORY_LENGTH = 445
const { stateByYear, eventsByYear } = runHistory(HISTORY_LENGTH)

const yearSelect = document.getElementById('year-select')
let currentYear = HISTORY_LENGTH - 1
for (let i = 0; i < HISTORY_LENGTH; i++) {
  const option = document.createElement('option')
  option.value = i
  option.textContent = i
  yearSelect.appendChild(option)
}
yearSelect.value = currentYear

yearSelect.onchange = e => {
  currentYear = e.target.value
  display(currentYear)
}

const display = (year) => {
  document.getElementById('tree-container').innerHTML = ''
  document.getElementById('tree-container')
    .appendChild(createTreeChart(stateByYear[year]))

  populateInfoContainer(eventsByYear.slice(0, year), stateByYear[year])

}

display(currentYear)
