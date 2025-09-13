import * as d3 from 'd3'
import runHistory from './lineage.js'
import createTreeChart from './createTreeChart.js'

const { familyTree } = runHistory(445)
document.getElementById('container')
  .appendChild(createTreeChart(familyTree))