export const pick = arr => {
  return arr[Math.floor(Math.random() * arr.length)]
}

export const romanize = (num) => {
  const lookup = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 }
  let result = ''
  if (num === 0) {
    throw new Error("No roman 0")
  }
  for (let i in lookup) {
    while (num >= lookup[i]) {
      result += i
      num -= lookup[i]
    }
  }
  return result
}
