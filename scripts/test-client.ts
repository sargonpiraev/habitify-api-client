import { HabitifyApiClient } from '../src/index.js'

async function main() {
  const apiKey = process.env.HABITIFY_API_KEY
  if (!apiKey) {
    console.error('Please set HABITIFY_API_KEY environment variable.')
    process.exit(1)
  }

  const client = new HabitifyApiClient(apiKey)

  try {
    // Получить список привычек на сегодня
    const habits = await client.getJournal({})
    console.log('Habits:', habits)
  } catch (err) {
    console.error('Error:', err)
  }
}

main()
