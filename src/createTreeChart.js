import * as d3 from 'd3'

// Based on https://observablehq.com/@d3/tree/2
// Copyright 2021-2023 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/tree

const createTreeChart = (data) => {
  const width = 928

  // Compute the tree height; this approach will allow the height of the
  // SVG to scale according to the breadth (width) of the tree layout.
  const root = d3.hierarchy(data)
  const dx = 10
  const dy = width / (root.height + 1)

  // Create and apply tree layout.
  const tree = d3.tree().nodeSize([dx, dy])
  tree(root)

  console.log(root)

  // Compute the extent of the tree. Note that x and y are swapped here
  // because in the tree layout, x is the breadth, but when displayed, the
  // tree extends right rather than down.
  let x0 = Infinity
  let x1 = -x0
  root.each(d => {
    if (d.x > x1) x1 = d.x
    if (d.x < x0) x0 = d.x
  })

  // Compute the adjusted height of the tree.
  const height = x1 - x0 + dx * 2

  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-dy / 3, x0 - dx, width, height])
    .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;")

  const link = svg.append("g")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5)
    .selectAll()
    .data(root.links())
    .join("path")
    .attr("d", d3.linkHorizontal()
      .x(d => d.y)
      .y(d => d.x))

  const node = svg.append("g")
    .attr("stroke-linejoin", "round")
    .attr("stroke-width", 3)
    .selectAll()
    .data(root.descendants())
    .join("g")
    .attr("transform", d => `translate(${d.y},${d.x})`)
    .attr("title", d => d.data.infoString())

  node.append("circle")
    .attr("fill", d => d.data.isMonarch ? "#880088" : "#555")
    .attr("r", 4)
    .text(d => d.data.circle())


  node.append("text")
    .attr("dy", "0.6em")
    .attr("x", d => d.children ? -6 : 6)
    .attr("text-anchor", d => d.children ? "end" : "start")
    .attr("text-decoration", d => d.data.alive ? "" : "line-through")
    .text(d => d.data.name)

  return svg.node()
}

export default createTreeChart