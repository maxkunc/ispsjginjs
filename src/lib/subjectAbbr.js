// Subject names from is.psjg.cz come formatted as "Full Name - Abbr" (e.g.
// "Informatika a výpočet.technika - Inf"). Pull out just the abbreviation
// for tight spaces where the full name doesn't fit.
export function subjectAbbreviation(name) {
  if (!name) return name
  const idx = name.lastIndexOf(' - ')
  return idx === -1 ? name : name.slice(idx + 3).trim()
}
