import axios, { AxiosInstance } from 'axios'
import {
  HabitifyApiResponse,
  JournalHabitsParams,
  HabitStatusResponse,
  UpdateHabitStatus,
  AddLogRequest,
  Habit,
  Mood,
  CreateMoodRequest,
  UpdateMoodRequest,
  Area,
  Log,
  Note,
  AddTextNoteRequest,
  AddImageNoteRequest,
  DeleteNotesRequest,
  Action,
  CreateActionRequest,
  UpdateActionRequest
} from './types'

class HabitifyApiClient {
  private client: AxiosInstance

  constructor(private readonly apiKey: string) {
    this.client = axios.create({
      baseURL: 'https://api.habitify.me',
      headers: { Authorization: this.apiKey },
    })
  }

  /**
   * Get habits from the journal with optional filters
   * @param params JournalHabitsParams
   */
  async getJournalHabits(params?: JournalHabitsParams): Promise<Habit[]> {
    const response = await this.client.get<HabitifyApiResponse<Habit[]>>('/journal', { params })
    return response.data.data
  }

  /**
   * Get habit status for a specific date
   */
  async getHabitStatus(habitId: string, target_date?: string): Promise<HabitStatusResponse> {
    const response = await this.client.get<HabitifyApiResponse<HabitStatusResponse>>(
      `/status/${habitId}`,
      target_date ? { params: { target_date } } : undefined
    )
    return response.data.data
  }

  /**
   * Update habit status for a specific date
   */
  async updateHabitStatus(
    habitId: string,
    status: UpdateHabitStatus,
    target_date: string
  ): Promise<void> {
    await this.client.put(`/status/${habitId}`, { status, target_date })
  }

  /**
   * Get logs for a habit
   */
  async getLogs(habitId: string, params?: { from?: string; to?: string }): Promise<Log[]> {
    const response = await this.client.get<HabitifyApiResponse<Log[]>>(
      `/logs/${habitId}`,
      params ? { params } : undefined
    )
    return response.data.data
  }

  /**
   * Add a log for a habit
   */
  async addLog(habitId: string, data: AddLogRequest): Promise<void> {
    await this.client.post(`/logs/${habitId}`, data)
  }

  /**
   * Delete a single log by id
   */
  async deleteLog(habitId: string, logId: string): Promise<void> {
    await this.client.delete(`/logs/${habitId}/${logId}`)
  }

  /**
   * Delete logs for a habit in a date range
   */
  async deleteLogs(habitId: string, params?: { from?: string; to?: string }): Promise<void> {
    await this.client.delete(
      `/logs/${habitId}`,
      params ? { params } : undefined
    )
  }

  /**
   * Get moods (optionally by date)
   */
  async getMoods(params?: { target_date?: string }): Promise<Mood[]> {
    const response = await this.client.get<HabitifyApiResponse<Mood[]>>(
      '/moods',
      params ? { params } : undefined
    )
    return response.data.data
  }

  /**
   * Get mood by id
   */
  async getMood(moodId: string): Promise<Mood> {
    const response = await this.client.get<HabitifyApiResponse<Mood>>(`/moods/${moodId}`)
    return response.data.data
  }

  /**
   * Create a new mood
   */
  async createMood(data: CreateMoodRequest): Promise<void> {
    await this.client.post('/moods', data)
  }

  /**
   * Update mood by id
   */
  async updateMood(moodId: string, data: UpdateMoodRequest): Promise<void> {
    await this.client.put(`/moods/${moodId}`, data)
  }

  /**
   * Delete mood by id
   */
  async deleteMood(moodId: string): Promise<void> {
    await this.client.delete(`/moods/${moodId}`)
  }

  /**
   * Get all areas
   */
  async getAreas(): Promise<Area[]> {
    const response = await this.client.get<HabitifyApiResponse<Area[]>>('/areas')
    return response.data.data
  }

  /**
   * Get all notes for a habit
   */
  async getNotes(habitId: string, params?: { from?: string; to?: string }): Promise<Note[]> {
    const response = await this.client.get<HabitifyApiResponse<Note[]>>(
      `/notes/${habitId}`,
      params ? { params } : undefined
    )
    return response.data.data
  }

  /**
   * Add a text note to a habit
   */
  async addTextNote(habitId: string, data: AddTextNoteRequest): Promise<void> {
    await this.client.post(`/notes/${habitId}`, data)
  }

  /**
   * Add an image note to a habit
   */
  async addImageNote(habitId: string, data: AddImageNoteRequest): Promise<void> {
    const formData = new FormData()
    formData.append('image', data.image)
    formData.append('created_at', data.created_at)
    await this.client.post(`/notes/addImageNote/${habitId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  }

  /**
   * Delete a single note by id
   */
  async deleteNote(habitId: string, noteId: string): Promise<void> {
    await this.client.delete(`/notes/${habitId}/${noteId}`)
  }

  /**
   * Delete notes for a habit in a date range
   */
  async deleteNotes(habitId: string, params?: DeleteNotesRequest): Promise<void> {
    await this.client.delete(`/notes/${habitId}`, params ? { data: params } : undefined)
  }

  /**
   * Get all actions for a habit
   */
  async getActions(habitId: string): Promise<Action[]> {
    const response = await this.client.get<HabitifyApiResponse<Action[]>>(`/actions/${habitId}`)
    return response.data.data
  }

  /**
   * Get a single action by id
   */
  async getAction(habitId: string, actionId: string): Promise<Action> {
    const response = await this.client.get<HabitifyApiResponse<Action>>(`/actions/${habitId}/${actionId}`)
    return response.data.data
  }

  /**
   * Create a new action for a habit
   */
  async createAction(habitId: string, data: CreateActionRequest): Promise<void> {
    await this.client.post(`/actions/${habitId}`, data)
  }

  /**
   * Update an action by id
   */
  async updateAction(habitId: string, actionId: string, data: UpdateActionRequest): Promise<void> {
    await this.client.put(`/actions/${habitId}/${actionId}`, data)
  }

  /**
   * Delete an action by id
   */
  async deleteAction(habitId: string, actionId: string): Promise<void> {
    await this.client.delete(`/actions/${habitId}/${actionId}`)
  }
}

export default HabitifyApiClient
