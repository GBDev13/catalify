import tailwindColors from 'tailwindcss/colors'
 
export const makeColors = () => {
    const colors = new Set<string>()

    const parsedColors = Object.entries(tailwindColors).flatMap(([name, values]) => {
        if (typeof values === 'string') {
            return []
        }
 
        return Object.entries(values).map(([tonality, hex]) => String(hex))
    })
 
    parsedColors.forEach((hex) => {
        if(!colors.has(hex)) {
            colors.add(hex)
        }
    })
 
    return Array.from(colors)
}