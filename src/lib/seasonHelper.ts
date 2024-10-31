export function getAllSeasonsFrom(startSeason: string): string[] {
    const [startYear] = startSeason.split("/").map(Number)
    const currentYear = new Date().getFullYear()
    const seasons = []
  
    for (let year = startYear; year <= currentYear; year++) {
      const nextYear = (year + 1).toString().slice(-2)
      seasons.push(`${year}/${nextYear}`)
    }
  
    return seasons
  }
