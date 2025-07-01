import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios'

export interface Logger {
  log: (...message: (string | object)[]) => void
  error: (...message: (string | object)[]) => void
  debug: (...message: (string | object)[]) => void
}

export interface HabitifyClientConfig {
  apiKey: string
  baseURL?: string
  timeout?: number
  headers?: Record<string, string>
  logger?: Logger
}

const defaultLogger: Logger = {
  log: () => {},
  error: () => {},
  debug: () => {}
}

export function createHabitifyClient(config: HabitifyClientConfig): AxiosInstance {
  const {
    apiKey,
    baseURL = 'https://api.habitify.me',
    timeout = 30000,
    headers = {},
    logger = defaultLogger
  } = config

  const client = axios.create({
    baseURL,
    timeout,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': apiKey,
      ...headers
    }
  })

  // Request interceptor for logging
  client.interceptors.request.use(
    (request: AxiosRequestConfig) => {
      const { method, url, params, data } = request
      logger.debug('Request:', JSON.stringify({ method, url, params, data }, null, 2))
      return request
    },
    (error: AxiosError) => {
      const { message, response } = error
      const { data } = response || {}
      logger.error('Request Error:', { message, response: { data } })
      return Promise.reject(error)
    }
  )

  // Response interceptor for error handling and logging
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      const { data } = response
      logger.debug('Response:', JSON.stringify({ data }))
      
      // Handle API-specific error format
      if (data && data.status === false) {
        const errorMessage = data.message || 'Unknown API error'
        throw new Error(errorMessage)
      }
      
      return response
    },
    (error: AxiosError) => {
      const { message, response } = error
      const { data } = response || {}
      logger.error('Response Error:', { message, response: { data } })
      
      // Handle API-specific error format
      if (data && data.status === false) {
        const errorMessage = data.message || 'Unknown API error'
        throw new Error(errorMessage)
      }
      
      return Promise.reject(error)
    }
  )

  return client
} 