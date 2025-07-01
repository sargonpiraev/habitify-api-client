# Habitify API Client

![npm version](https://img.shields.io/npm/v/@sargonpiraev/habitify-api-client)
![npm downloads](https://img.shields.io/npm/dw/@sargonpiraev/habitify-api-client)
![license](https://img.shields.io/github/license/sargonpiraev/habitify-api-client)
![pipeline status](https://gitlab.com/sargonpiraev/habitify-api-client/badges/main/pipeline.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
[![Join Discord](https://img.shields.io/discord/1331631275464671347?color=7289da&label=Discord&logo=discord)](https://discord.gg/ZsWGxRGj)

A TypeScript client for the Habitify API with complete type safety and modern developer experience.

## Features

- 🔥 **TypeScript first** - Full type safety with comprehensive type definitions
- 🚀 **Complete API coverage** - All Habitify API endpoints supported
- 📝 **Self-documenting** - JSDoc comments and type inference provide excellent IDE support
- 🛡️ **Built-in validation** - Request/response validation with clear error messages
- ⚡ **Axios integration** - Robust HTTP client with interceptors and retry logic
- 🎯 **Flexible configuration** - Support for different environments and auth methods
- 📦 **Tree-shakeable** - Import only what you need for optimal bundle size
- 🔧 **Easy debugging** - Comprehensive logging and error handling

## Get Your Credentials

Before installation, you'll need Habitify API credentials:

1. Open Habitify app on your mobile device
2. Go to Settings → Account → API
3. Generate new API key
4. Save API key for installation steps below

## Requirements

- Node.js >= v18.0.0
- Habitify API key
- npm >= 8.0.0

## Installation

```bash
npm install @sargonpiraev/habitify-api-client
```

## Quick Start

```typescript
import { createHabitifyClient } from '@sargonpiraev/habitify-api-client'

// Create a configured client
const client = createHabitifyClient({
  apiKey: 'your-api-key',
  logger: {
    log: console.log,
    error: console.error,
    debug: console.debug
  }
})

// Get today's habits
const habits = await client.getJournal({
  target_date: new Date().toISOString()
})

console.log(`Found ${habits.length} habits for today`)
```

## Configuration

### Required Parameters
```typescript
const client = createHabitifyClient({
  apiKey: 'your-api-key', // Get from Habitify app settings
})
```

### Optional Parameters
```typescript
const client = createHabitifyClient({
  apiKey: 'your-api-key',
  baseURL: 'https://api.habitify.me', // default
  timeout: 30000, // 30 seconds default
  logger: {
    log: console.log,
    error: console.error,
    debug: console.debug
  },
  headers: {
    'Custom-Header': 'value'
  }
})
```

## Usage Examples

### Journal Operations
```typescript
// Get habits for specific date
const habits = await client.getJournal({
  target_date: '2025-01-15',
  status: 'in_progress',
  order_by: 'priority'
})

// Get habit status
const status = await client.getHabitStatus({
  habit_id: 'habit-123',
  target_date: '2025-01-15'
})

// Update habit status
await client.updateHabitStatus({
  habit_id: 'habit-123',
  status: 'completed',
  target_date: '2025-01-15'
})
```

### Logs Management
```typescript
// Get logs for a habit
const logs = await client.getLogs({
  habit_id: 'habit-123',
  from: '2025-01-01',
  to: '2025-01-31'
})

// Add a new log
await client.addLog({
  habit_id: 'habit-123',
  unit_type: 'rep',
  value: 50,
  target_date: '2025-01-15'
})

// Delete a log
await client.deleteLog({
  habit_id: 'habit-123',
  log_id: 'log-456'
})
```

### Mood Tracking
```typescript
// Get moods for today
const moods = await client.getMoods({
  target_date: new Date().toISOString()
})

// Create a new mood
await client.createMood({
  value: 4, // 1-5 scale
  created_at: new Date().toISOString()
})

// Update existing mood
await client.updateMood({
  mood_id: 'mood-123',
  value: 5,
  created_at: new Date().toISOString()
})
```

### Notes and Actions
```typescript
// Add text note to habit
await client.addTextNote({
  habit_id: 'habit-123',
  content: 'Great workout today!',
  created_at: new Date().toISOString()
})

// Create action reminder
await client.createAction({
  habit_id: 'habit-123',
  title: 'Prepare workout clothes',
  remind_at: '2025-01-15T08:00:00Z'
})

// Get all areas
const areas = await client.getAreas()
```

## API Reference

### Authentication
All endpoints require API key authentication. Get your API key from Habitify mobile app settings.

### Rate Limiting
- API rate limits apply per Habitify account
- Rate limit headers included in responses
- Automatic retry logic for rate limit errors

### Error Handling
```typescript
try {
  const habits = await client.getJournal()
} catch (error) {
  if (error.response?.status === 401) {
    console.error('Invalid API key')
  } else if (error.response?.status === 429) {
    console.error('Rate limit exceeded')
  } else {
    console.error('API error:', error.message)
  }
}
```

### Available Methods
- **Journal**: `getJournal()`, `getHabitStatus()`, `updateHabitStatus()`
- **Logs**: `getLogs()`, `addLog()`, `deleteLog()`, `deleteLogs()`
- **Moods**: `getMoods()`, `getMood()`, `createMood()`, `updateMood()`, `deleteMood()`
- **Areas**: `getAreas()`
- **Notes**: `getNotes()`, `addTextNote()`, `addImageNote()`, `deleteNote()`, `deleteNotes()`
- **Actions**: `getActions()`, `getAction()`, `createAction()`, `updateAction()`, `deleteAction()`

See the [Habitify API documentation](https://docs.habitify.me) for complete reference.

## Roadmap

**Coming Soon** 🚀

- [ ] **Enhanced Type Safety**: Additional validation and type guards
- [ ] **Response Caching**: Intelligent caching for frequently accessed data
- [ ] **Batch Operations**: Support for bulk API operations
- [ ] **Rate Limiting**: Built-in rate limiting and retry logic
- [ ] **Offline Support**: Offline-first capabilities with sync
- [ ] **React Hooks**: React hooks package for easier integration

**Completed** ✅

- [x] **Full API Coverage**: Complete Habitify API integration
- [x] **Type Safety**: Complete TypeScript types and interfaces
- [x] **Error Handling**: Comprehensive error management and logging
- [x] **Tree Shaking**: Optimized bundle size with selective imports

**Community Requests** 💭

Have an idea for Habitify API Client? [Open an issue](https://gitlab.com/sargonpiraev/habitify-api-client/issues) or contribute to our roadmap!

## Support This Project

Hi! I'm Sargon, a software engineer passionate about API integrations and developer tools. I create open-source API clients to help developers integrate with their favorite services more easily.

Your support helps me continue developing and maintaining these tools, and motivates me to create new integrations that make developer workflows even more efficient! 🚀

[![Support on Boosty](https://img.shields.io/badge/Support-Boosty-orange?logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K)](https://boosty.to/sargonpiraev)

## Connect with Author

- 🌐 Visit [sargonpiraev.com](https://sargonpiraev.com)
- 📧 Email: [sargonpiraev@gmail.com](mailto:sargonpiraev@gmail.com)
- 💬 Join [Discord](https://discord.gg/ZsWGxRGj)

## Development

### Local Setup
```bash
git clone https://gitlab.com/sargonpiraev/habitify-api-client.git
cd habitify-api-client
npm install
```

### Build and Test
```bash
# Build the project
npm run build

# Run tests
npm run test

# Lint code
npm run lint

# Type checking
npm run typecheck

# Test with real API
HABITIFY_API_KEY=your-key npm run test-client
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Add tests for new functionality
5. Run tests and linting
6. Submit a pull request

## License

MIT - see LICENSE file for details 