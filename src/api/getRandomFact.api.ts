export const getRandomFact = async () => {
    try {
        const response = await fetch('https://uselessfacts.jsph.pl/random.json')
        const data = await response.json()
        return data.text
    } catch (error) {
        console.error('Error fetching random fact:', error)
        return 'Could not fetch random fact'
    }
}
