import { flattenTree } from './utils'

const populateInfoContainer = (eventsByYear, familyTree) => {
  const eventsList = document.getElementById('events')
  eventsList.innerHTML = ''

  eventsByYear.forEach((events, year) => {
    if (events.length > 0) {
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
  livingList.innerHTML = ''

  flattenTree(familyTree)
    .filter(p => p.alive)
    .sort((a, b) => a.isMonarch ? -Infinity : b.circle() - a.circle())
    .forEach(person => {
      const element = document.createElement('p')
      element.textContent = person.toString()
      livingList.appendChild(element)
    })
}

export default populateInfoContainer
