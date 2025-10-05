import runHistory from './lineage.js'
import createTreeChart from './createTreeChart.js'
import populateInfoContainer from './populateInfoContainer.js'

const settings = { historyLength: 500 }
const { stateByYear, eventsByYear } = runHistory(settings.historyLength)

const yearSelect = document.getElementById('year-select')
let currentYear = settings.historyLength - 1

for (let i = 0; i < settings.historyLength; i++) {
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
