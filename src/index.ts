import { AxiosInstance } from 'axios'
import { createHabitifyClient, type HabitifyClientConfig, type Logger } from './client.js'
import {
  ApiResponse,
  GetJournalParams,
  GetHabitStatusResult,
  Habit,
  Mood,
  Area,
  Log,
  Note,
  Action,
  GetHabitStatusParams,
  UpdateHabitStatusParams,
  GetLogsParams,
  AddLogParamsFull,
  DeleteLogParams,
  DeleteLogsParamsFull,
  GetMoodsParams,
  GetMoodParams,
  CreateMoodParamsFull,
  UpdateMoodParamsFull,
  DeleteMoodParams,
  GetNotesParams,
  AddTextNoteParamsFull,
  AddImageNoteParamsFull,
  DeleteNoteParams,
  DeleteNotesParamsFull,
  GetActionsParams,
  GetActionParams,
  CreateActionParamsFull,
  UpdateActionParamsFull,
  DeleteActionParams,
} from './types.js'

// Export client creation function and types
export { createHabitifyClient, type HabitifyClientConfig, type Logger }

// Export all types
export * from './types.js'

// YYYY-MM-DDTHH:mm:ss±hh:mm
export const toISOString = (date: string) => {
  const d = new Date(date)
  const pad = (n: number) => n.toString().padStart(2, '0')
  const year = d.getFullYear()
  const month = pad(d.getMonth() + 1)
  const day = pad(d.getDate())
  const hours = pad(d.getHours())
  const minutes = pad(d.getMinutes())
  const seconds = pad(d.getSeconds())
  const offset = -d.getTimezoneOffset()
  const sign = offset >= 0 ? '+' : '-'
  const absOffset = Math.abs(offset)
  const offsetHours = pad(Math.floor(absOffset / 60))
  const offsetMinutes = pad(absOffset % 60)
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${offsetHours}:${offsetMinutes}`
}

const getTargetDate = (date: string | undefined) => toISOString(date ?? new Date().toISOString())

export class HabitifyApiClient {
  public client: AxiosInstance

  constructor(
    private readonly apiKey: string,
    private readonly logger: Logger
  ) {
    this.client = createHabitifyClient({
      apiKey,
      logger
    })
  }

  /**
   * Get habits from the journal with optional filters
   */
  async getJournal(params: GetJournalParams = {}): Promise<Habit[]> {
    params.target_date = getTargetDate(params.target_date)
    const response = await this.client.get<ApiResponse<Habit[]>>('/journal', { params })
    return response.data.data
  }

  /**
   * Get habit status for a specific date
   */
  async getHabitStatus(_params: GetHabitStatusParams): Promise<GetHabitStatusResult> {
    const { habit_id, target_date } = _params
    const params = { target_date: getTargetDate(target_date) }
    const response = await this.client.get<ApiResponse<GetHabitStatusResult>>(`/status/${habit_id}`, { params })
    return response.data.data
  }

  /**
   * Update habit status for a specific date
   */
  async updateHabitStatus(params: UpdateHabitStatusParams): Promise<void> {
    const { habit_id, status, target_date } = params
    const body = { status, target_date: getTargetDate(target_date) }
    const response = await this.client.put(`/status/${habit_id}`, body)
    return response.data.data
  }

  /**
   * Get logs for a habit
   */
  async getLogs(_params: GetLogsParams): Promise<Log[]> {
    const { habit_id, ...params } = _params
    const response = await this.client.get<ApiResponse<Log[]>>(`/logs/${habit_id}`, { params })
    return response.data.data
  }

  /**
   * Add a log for a habit
   */
  async addLog(_params: AddLogParamsFull): Promise<void> {
    const { habit_id, ...params } = _params
    params.target_date = getTargetDate(params.target_date)
    const response = await this.client.post(`/logs/${habit_id}`, params)
    return response.data.data
  }

  /**
   * Delete a single log by id
   */
  async deleteLog(params: DeleteLogParams): Promise<void> {
    const { habit_id, log_id } = params
    const response = await this.client.delete(`/logs/${habit_id}/${log_id}`)
    return response.data.data
  }

  /**
   * Delete logs for a habit in a date range
   */
  async deleteLogs(_params: DeleteLogsParamsFull): Promise<void> {
    const { habit_id, ...params } = _params
    const response = await this.client.delete(`/logs/${habit_id}`, { params })
    return response.data.data
  }

  /**
   * Get moods (optionally by date)
   */
  async getMoods(params: GetMoodsParams = {}): Promise<Mood[]> {
    params.target_date = getTargetDate(params.target_date)
    const response = await this.client.get<ApiResponse<Mood[]>>('/moods', { params })
    return response.data.data
  }

  /**
   * Get mood by id
   */
  async getMood(params: GetMoodParams): Promise<Mood> {
    const { mood_id } = params
    const response = await this.client.get<ApiResponse<Mood>>(`/moods/${mood_id}`)
    return response.data.data
  }

  /**
   * Create a new mood
   */
  async createMood(params: CreateMoodParamsFull): Promise<void> {
    const response = await this.client.post('/moods', params)
    return response.data.data
  }

  /**
   * Update mood by id
   */
  async updateMood(_params: UpdateMoodParamsFull): Promise<void> {
    const { mood_id, ...params } = _params
    const response = await this.client.put(`/moods/${mood_id}`, params)
    return response.data.data
  }

  /**
   * Delete mood by id
   */
  async deleteMood(params: DeleteMoodParams): Promise<void> {
    const { mood_id } = params
    const response = await this.client.delete(`/moods/${mood_id}`)
    return response.data.data
  }

  /**
   * Get all areas
   */
  async getAreas(): Promise<Area[]> {
    const response = await this.client.get<ApiResponse<Area[]>>('/areas')
    return response.data.data
  }

  /**
   * Get all notes for a habit
   */
  async getNotes(_params: GetNotesParams): Promise<Note[]> {
    const { habit_id, ...params } = _params
    const response = await this.client.get<ApiResponse<Note[]>>(`/notes/${habit_id}`, { params })
    return response.data.data
  }

  /**
   * Add a text note to a habit
   */
  async addTextNote(_params: AddTextNoteParamsFull): Promise<void> {
    const { habit_id, ...params } = _params
    const response = await this.client.post(`/notes/${habit_id}`, params)
    return response.data.data
  }

  /**
   * Add an image note to a habit
   */
  async addImageNote(_params: AddImageNoteParamsFull): Promise<void> {
    const { habit_id, ...params } = _params
    const formData = new globalThis.FormData()
    formData.append('image', params.image)
    formData.append('created_at', params.created_at)
    const headers = { 'Content-Type': 'multipart/form-data' }
    const response = await this.client.post(`/notes/addImageNote/${habit_id}`, formData, { headers })
    return response.data.data
  }

  /**
   * Delete a single note by id
   */
  async deleteNote(params: DeleteNoteParams): Promise<void> {
    const { habit_id, note_id } = params
    const response = await this.client.delete(`/notes/${habit_id}/${note_id}`)
    return response.data.data
  }

  /**
   * Delete notes for a habit in a date range
   */
  async deleteNotes(_params: DeleteNotesParamsFull): Promise<void> {
    const { habit_id, ...params } = _params
    const response = await this.client.delete(`/notes/${habit_id}`, { params })
    return response.data.data
  }

  /**
   * Get all actions for a habit
   */
  async getActions(params: GetActionsParams): Promise<Action[]> {
    const { habit_id } = params
    const response = await this.client.get<ApiResponse<Action[]>>(`/actions/${habit_id}`)
    return response.data.data
  }

  /**
   * Get a single action by id
   */
  async getAction(params: GetActionParams): Promise<Action> {
    const { habit_id, action_id } = params
    const response = await this.client.get<ApiResponse<Action>>(`/actions/${habit_id}/${action_id}`)
    return response.data.data
  }

  /**
   * Create a new action for a habit
   */
  async createAction(_params: CreateActionParamsFull): Promise<void> {
    const { habit_id, ...params } = _params
    const response = await this.client.post(`/actions/${habit_id}`, params)
    return response.data.data
  }

  /**
   * Update an action by id
   */
  async updateAction(_params: UpdateActionParamsFull): Promise<void> {
    const { habit_id, action_id, ...params } = _params
    const response = await this.client.put(`/actions/${habit_id}/${action_id}`, params)
    return response.data.data
  }

  /**
   * Delete an action by id
   */
  async deleteAction(params: DeleteActionParams): Promise<void> {
    const { habit_id, action_id } = params
    const response = await this.client.delete(`/actions/${habit_id}/${action_id}`)
    return response.data.data
  }
}
