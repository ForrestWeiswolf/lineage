import runHistory from './lineage.js'
import createTreeChart from './createTreeChart.js'
import populateInfoContainer from './populateInfoContainer.js'

const settings = { historyLength: 500, baseLifespan: 220 }
const { stateByYear, eventsByYear } = runHistory(settings)

const yearSelect = document.getElementById('year-select')
let currentYear = settings.historyLength - 1

for (let i = 0; i < settings.historyLength; i++) {
  const option = document.createElement('option')
  option.value = i
  option.textContent = i
  yearSelect.appendChild(option)
}

yearSelect.onchange = e => {
  currentYear = e.target.value
  display(currentYear)
}

document.getElementById('next').onclick = e => {
  currentYear = currentYear + 1
  display(currentYear)
}

document.getElementById('prev').onclick = e => {
  currentYear = currentYear - 1
  display(currentYear)
}

const display = (year) => {
  document.getElementById('tree-container').innerHTML = ''
  document.getElementById('tree-container')
    .appendChild(createTreeChart(stateByYear[year]))

  populateInfoContainer(eventsByYear.slice(0, year), stateByYear[year])
  yearSelect.value = currentYear
}

display(currentYear)
