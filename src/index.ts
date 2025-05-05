import axios, { AxiosInstance } from 'axios'
import {
  ApiResponse,
  GetJournalParams,
  HabitStatusResponse,
  UpdateHabitStatus,
  AddLogParams,
  Habit,
  Mood,
  CreateMoodParams,
  UpdateMoodParams,
  Area,
  Log,
  Note,
  AddTextNoteParams,
  AddImageNoteParams,
  DeleteNotesParams,
  Action,
  CreateActionParams,
  UpdateActionParams,
} from './types.js'

export class HabitifyApiClient {
  private client: AxiosInstance

  constructor(private readonly apiKey: string) {
    this.client = axios.create({
      baseURL: 'https://api.habitify.me',
      headers: { Authorization: this.apiKey },
    })
    this.client.interceptors.request.use(
      (request) => {
        const { method, url, params } = request
        console.debug('Starting Request', JSON.stringify({ method, url, params }, null, 2))
        return request
      },
      (error) => {
        const {
          message,
          response: { data },
        } = error
        console.debug('Request Error:', { message, response: { data } })
        return Promise.reject(error)
      }
    )
    this.client.interceptors.response.use(
      (response) => {
        const { data } = response
        console.log('Response:', JSON.stringify({ data }))
        if (data.status === false) throw new Error(data.message || 'Unknown API error')
        return response
      },
      (error) => {
        const {
          message,
          response: { data },
        } = error
        console.debug('Response Error:', { message, response: { data } })
        return Promise.reject(error)
      }
    )
  }

  /**
   * Get habits from the journal with optional filters
   * @param params GetJournalParams
   */
  async getJournal(params: GetJournalParams): Promise<Habit[]> {
    params.target_date = params.target_date || new Date().toISOString()
    const response = await this.client.get<ApiResponse<Habit[]>>('/journal', { params })
    if (response.data.status === false) throw new Error(response.data.message)
    return response.data.data
  }

  /**
   * Get habit status for a specific date
   */
  async getHabitStatus(
    habitId: string,
    target_date: string = new Date().toISOString()
  ): Promise<HabitStatusResponse> {
    const response = await this.client.get<ApiResponse<HabitStatusResponse>>(`/status/${habitId}`, {
      params: { target_date },
    })
    if (response.data.status === false) throw new Error(response.data.message)
    return response.data.data
  }

  /**
   * Update habit status for a specific date
   */
  async updateHabitStatus(
    habitId: string,
    status: UpdateHabitStatus,
    target_date: string = new Date().toISOString()
  ): Promise<void> {
    const response = await this.client.put(`/status/${habitId}`, { status, target_date })
    if (response.data.status === false) throw new Error(response.data.message)
    return response.data.data
  }

  /**
   * Get logs for a habit
   */
  async getLogs(habitId: string, params: { from?: string; to?: string }): Promise<Log[]> {
    const response = await this.client.get<ApiResponse<Log[]>>(`/logs/${habitId}`, { params })
    if (response.data.status === false) throw new Error(response.data.message)
    return response.data.data
  }

  /**
   * Add a log for a habit
   */
  async addLog(habitId: string, data: AddLogParams): Promise<void> {
    const response = await this.client.post(`/logs/${habitId}`, data)
    if (response.data.status === false) throw new Error(response.data.message)
    return response.data.data
  }

  /**
   * Delete a single log by id
   */
  async deleteLog(habitId: string, logId: string): Promise<void> {
    const response = await this.client.delete(`/logs/${habitId}/${logId}`)
    if (response.data.status === false) throw new Error(response.data.message)
    return response.data.data
  }

  /**
   * Delete logs for a habit in a date range
   */
  async deleteLogs(habitId: string, params?: { from?: string; to?: string }): Promise<void> {
    const response = await this.client.delete(`/logs/${habitId}`, params ? { params } : undefined)
    if (response.data.status === false) throw new Error(response.data.message)
    return response.data.data
  }

  /**
   * Get moods (optionally by date)
   */
  async getMoods(target_date: string = new Date().toISOString()): Promise<Mood[]> {
    const response = await this.client.get<ApiResponse<Mood[]>>('/moods', {
      params: { target_date },
    })
    if (response.data.status === false) throw new Error(response.data.message)
    return response.data.data
  }

  /**
   * Get mood by id
   */
  async getMood(moodId: string): Promise<Mood> {
    const response = await this.client.get<ApiResponse<Mood>>(`/moods/${moodId}`)
    if (response.data.status === false) throw new Error(response.data.message)
    return response.data.data
  }

  /**
   * Create a new mood
   */
  async createMood(data: CreateMoodParams): Promise<void> {
    const response = await this.client.post('/moods', data)
    if (response.data.status === false) throw new Error(response.data.message)
    return response.data.data
  }

  /**
   * Update mood by id
   */
  async updateMood(moodId: string, data: UpdateMoodParams): Promise<void> {
    const response = await this.client.put(`/moods/${moodId}`, data)
    if (response.data.status === false) throw new Error(response.data.message)
    return response.data.data
  }

  /**
   * Delete mood by id
   */
  async deleteMood(moodId: string): Promise<void> {
    const response = await this.client.delete(`/moods/${moodId}`)
    if (response.data.status === false) throw new Error(response.data.message)
    return response.data.data
  }

  /**
   * Get all areas
   */
  async getAreas(): Promise<Area[]> {
    const response = await this.client.get<ApiResponse<Area[]>>('/areas')
    if (response.data.status === false) throw new Error(response.data.message)
    return response.data.data
  }

  /**
   * Get all notes for a habit
   */
  async getNotes(habitId: string, params?: { from?: string; to?: string }): Promise<Note[]> {
    const response = await this.client.get<ApiResponse<Note[]>>(
      `/notes/${habitId}`,
      params ? { params } : undefined
    )
    if (response.data.status === false) throw new Error(response.data.message)
    return response.data.data
  }

  /**
   * Add a text note to a habit
   */
  async addTextNote(habitId: string, data: AddTextNoteParams): Promise<void> {
    const response = await this.client.post(`/notes/${habitId}`, data)
    if (response.data.status === false) throw new Error(response.data.message)
    return response.data.data
  }

  /**
   * Add an image note to a habit
   */
  async addImageNote(habitId: string, data: AddImageNoteParams): Promise<void> {
    const formData = new FormData()
    formData.append('image', data.image)
    formData.append('created_at', data.created_at)
    const headers = { 'Content-Type': 'multipart/form-data' }
    const response = await this.client.post(`/notes/addImageNote/${habitId}`, formData, { headers })
    if (response.data.status === false) throw new Error(response.data.message)
    return response.data.data
  }

  /**
   * Delete a single note by id
   */
  async deleteNote(habitId: string, noteId: string): Promise<void> {
    const response = await this.client.delete(`/notes/${habitId}/${noteId}`)
    if (response.data.status === false) throw new Error(response.data.message)
    return response.data.data
  }

  /**
   * Delete notes for a habit in a date range
   */
  async deleteNotes(habitId: string, params?: DeleteNotesParams): Promise<void> {
    const response = await this.client.delete(
      `/notes/${habitId}`,
      params ? { data: params } : undefined
    )
    if (response.data.status === false) throw new Error(response.data.message)
    return response.data.data
  }

  /**
   * Get all actions for a habit
   */
  async getActions(habitId: string): Promise<Action[]> {
    const response = await this.client.get<ApiResponse<Action[]>>(`/actions/${habitId}`)
    if (response.data.status === false) throw new Error(response.data.message)
    return response.data.data
  }

  /**
   * Get a single action by id
   */
  async getAction(habitId: string, actionId: string): Promise<Action> {
    const response = await this.client.get<ApiResponse<Action>>(`/actions/${habitId}/${actionId}`)
    if (response.data.status === false) throw new Error(response.data.message)
    return response.data.data
  }

  /**
   * Create a new action for a habit
   */
  async createAction(habitId: string, data: CreateActionParams): Promise<void> {
    const response = await this.client.post(`/actions/${habitId}`, data)
    if (response.data.status === false) throw new Error(response.data.message)
    return response.data.data
  }

  /**
   * Update an action by id
   */
  async updateAction(habitId: string, actionId: string, data: UpdateActionParams): Promise<void> {
    const response = await this.client.put(`/actions/${habitId}/${actionId}`, data)
    if (response.data.status === false) throw new Error(response.data.message)
    return response.data.data
  }

  /**
   * Delete an action by id
   */
  async deleteAction(habitId: string, actionId: string): Promise<void> {
    const response = await this.client.delete(`/actions/${habitId}/${actionId}`)
    if (response.data.status === false) throw new Error(response.data.message)
    return response.data.data
  }
}
