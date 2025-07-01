# Habitify API Client

![npm version](https://img.shields.io/npm/v/@sargonpiraev/habitify-api-client)
![npm downloads](https://img.shields.io/npm/dw/@sargonpiraev/habitify-api-client)
![license](https://img.shields.io/github/license/sargonpiraev/habitify-api-client)
![pipeline status](https://gitlab.com/sargonpiraev/habitify-api-client/badges/main/pipeline.svg)

**Simple TypeScript client for Habitify API. Just pass your API key and start coding!**

## 🚀 Quick Start

```typescript
import { HabitifyApiClient } from '@sargonpiraev/habitify-api-client'

const client = new HabitifyApiClient('your-api-key')

// Get today's habits
const habits = await client.getJournal()

// Update habit status
await client.updateHabitStatus('habit-123', 'completed')

// Add a workout log
await client.addLog('habit-456', {
  unit_type: 'rep',
  value: 50,
  target_date: '2025-01-15',
})
```

## 📦 Installation

```bash
npm install @sargonpiraev/habitify-api-client
```

## 🔑 Get Your API Key

1. Open Habitify app on your mobile
2. Go to Settings → Account → API
3. Generate new API key
4. Use it in your code

## 📖 Usage

### Basic Operations

```typescript
const client = new HabitifyApiClient('your-api-key')

// Journal
const habits = await client.getJournal({ target_date: '2025-01-15' })
const status = await client.getHabitStatus('habit-123')
await client.updateHabitStatus('habit-123', 'completed')

// Logs
const logs = await client.getLogs('habit-123')
await client.addLog('habit-123', { unit_type: 'min', value: 30 })

// Moods
const moods = await client.getMoods()
await client.createMood({ value: 4, created_at: new Date().toISOString() })

// Areas
const areas = await client.getAreas()
```

### Raw HTTP Methods

```typescript
// For maximum flexibility, use raw HTTP methods
const data = await client.get('/custom-endpoint', { param1: 'value' })
await client.post('/custom-endpoint', { data: 'value' })
await client.put('/custom-endpoint', { data: 'value' })
await client.delete('/custom-endpoint')
```

## ✨ Features

- 🔥 **Zero configuration** - just pass your API key
- ⚡ **TypeScript ready** - full type definitions included
- 🔍 **Request tracking** - automatic Request ID generation
- 🛡️ **Error handling** - meaningful error messages
- 📦 **Lightweight** - minimal dependencies (only axios)
- 🚀 **Simple API** - easy to use and understand

## 🛠️ Perfect for Building

- **MCP Servers** - integrate with Claude and other AI tools
- **Automation Scripts** - sync habits with other services
- **Analytics Tools** - analyze your habit data
- **Mobile Apps** - build custom habit trackers
- **Web Dashboards** - visualize your progress

## 📊 API Reference

All methods return promises and handle errors automatically.

### Journal Methods

- `getJournal(params?)` - Get habits for a date
- `getHabitStatus(habitId, targetDate?)` - Get habit status
- `updateHabitStatus(habitId, status, targetDate?)` - Update habit

### Log Methods

- `getLogs(habitId, params?)` - Get logs for habit
- `addLog(habitId, data)` - Add new log entry

### Mood Methods

- `getMoods(params?)` - Get mood entries
- `createMood(data)` - Create new mood

### Other Methods

- `getAreas()` - Get all habit areas

## 🔮 Roadmap

Want to make this client even better? Here's what's coming:

**v1.0 - Professional Grade**

- Full OpenTelemetry tracing integration
- HTTP/2 support with undici
- Request cancellation & retry logic
- Response caching with TTL
- Batch operations support
- Real-time WebSocket events

**Your Ideas Welcome!**

- Open an [issue](https://gitlab.com/sargonpiraev/habitify-api-client/issues)
- Join our [Discord](https://discord.gg/ZsWGxRGj)

## 🤝 Perfect for MCP Servers

This client is designed specifically for building MCP (Model Context Protocol) servers:

```typescript
// Example MCP server integration
import { HabitifyApiClient } from '@sargonpiraev/habitify-api-client'

const habitify = new HabitifyApiClient(process.env.HABITIFY_API_KEY)

// Use in your MCP server tools
async function getHabitsForAI() {
  const habits = await habitify.getJournal()
  return habits.map((h) => `${h.name}: ${h.status}`)
}
```

## 📄 License

MIT - see [LICENSE](LICENSE) file for details

---

**Made with ❤️ for the developer community**

[sargonpiraev.com](https://sargonpiraev.com) • [Discord](https://discord.gg/ZsWGxRGj) • [Boosty](https://boosty.to/sargonpiraev)
