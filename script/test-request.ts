import assert from 'assert'
import { HabitifyApiClient } from '../src/HabitifyApiClient.js'
import dotenv from 'dotenv'

dotenv.config()

const habitifyApiClient = new HabitifyApiClient(process.env.HABITIFY_API_KEY || '')

const result = await habitifyApiClient.getAreas()

assert.deepEqual(result, {
  message: 'Success',
  data: [],
  version: 'v1.2',
  status: true,
  errors: [],
})

console.log(result)
