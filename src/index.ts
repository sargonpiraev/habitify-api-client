import axios, { AxiosInstance } from 'axios'
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
import { format } from 'date-fns-tz'

// YYYY-MM-DDTHH:mm:ss±hh:mm
export const toISOString = (date: string) => format(date, "yyyy-MM-dd'T'HH:mm:ssXXX")
const getTargetDate = (date: string | undefined) => toISOString(date ?? new Date().toISOString())

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
        console.log('Request', JSON.stringify({ method, url, params }, null, 2))
        return request
      },
      (error) => {
        const { message, response } = error
        const { data } = response
        console.error('Request Error:', { message, response: { data } })
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
        const { message, response } = error
        const { data } = response
        console.error('Response Error:', { message, response: { data } })
        if (data.status === false)
          return Promise.reject(new Error(data.message || 'Unknown API error'))
        return Promise.reject(error)
      }
    )
  }

  /**
   * Get habits from the journal with optional filters
   */
  async getJournal(params: GetJournalParams): Promise<Habit[]> {
    params.target_date = getTargetDate(params.target_date)
    const response = await this.client.get<ApiResponse<Habit[]>>('/journal', { params })
    return response.data.data
  }

  /**
   * Get habit status for a specific date
   */
  async getHabitStatus(_params: GetHabitStatusParams): Promise<GetHabitStatusResult> {
    const { habitId, target_date } = _params
    const params = { target_date: getTargetDate(target_date) }
    const response = await this.client.get<ApiResponse<GetHabitStatusResult>>(
      `/status/${habitId}`,
      { params }
    )
    return response.data.data
  }

  /**
   * Update habit status for a specific date
   */
  async updateHabitStatus(params: UpdateHabitStatusParams): Promise<void> {
    const { habitId, status, target_date } = params
    const body = { status, target_date: getTargetDate(target_date) }
    const response = await this.client.put(`/status/${habitId}`, body)
    return response.data.data
  }

  /**
   * Get logs for a habit
   */
  async getLogs(_params: GetLogsParams): Promise<Log[]> {
    const { habitId, ...params } = _params
    const response = await this.client.get<ApiResponse<Log[]>>(`/logs/${habitId}`, { params })
    return response.data.data
  }

  /**
   * Add a log for a habit
   */
  async addLog(_params: AddLogParamsFull): Promise<void> {
    const { habitId, ...params } = _params
    params.target_date = getTargetDate(params.target_date)
    const response = await this.client.post(`/logs/${habitId}`, params)
    return response.data.data
  }

  /**
   * Delete a single log by id
   */
  async deleteLog(params: DeleteLogParams): Promise<void> {
    const { habitId, logId } = params
    const response = await this.client.delete(`/logs/${habitId}/${logId}`)
    return response.data.data
  }

  /**
   * Delete logs for a habit in a date range
   */
  async deleteLogs(_params: DeleteLogsParamsFull): Promise<void> {
    const { habitId, ...params } = _params
    const response = await this.client.delete(`/logs/${habitId}`, { params })
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
    const { moodId } = params
    const response = await this.client.get<ApiResponse<Mood>>(`/moods/${moodId}`)
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
    const { moodId, ...params } = _params
    const response = await this.client.put(`/moods/${moodId}`, params)
    return response.data.data
  }

  /**
   * Delete mood by id
   */
  async deleteMood(params: DeleteMoodParams): Promise<void> {
    const { moodId } = params
    const response = await this.client.delete(`/moods/${moodId}`)
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
    const { habitId, ...params } = _params
    const response = await this.client.get<ApiResponse<Note[]>>(`/notes/${habitId}`, { params })
    return response.data.data
  }

  /**
   * Add a text note to a habit
   */
  async addTextNote(_params: AddTextNoteParamsFull): Promise<void> {
    const { habitId, ...params } = _params
    const response = await this.client.post(`/notes/${habitId}`, params)
    return response.data.data
  }

  /**
   * Add an image note to a habit
   */
  async addImageNote(_params: AddImageNoteParamsFull): Promise<void> {
    const { habitId, ...params } = _params
    const formData = new FormData()
    formData.append('image', params.image)
    formData.append('created_at', params.created_at)
    const headers = { 'Content-Type': 'multipart/form-data' }
    const response = await this.client.post(`/notes/addImageNote/${habitId}`, formData, { headers })
    return response.data.data
  }

  /**
   * Delete a single note by id
   */
  async deleteNote(params: DeleteNoteParams): Promise<void> {
    const { habitId, noteId } = params
    const response = await this.client.delete(`/notes/${habitId}/${noteId}`)
    return response.data.data
  }

  /**
   * Delete notes for a habit in a date range
   */
  async deleteNotes(_params: DeleteNotesParamsFull): Promise<void> {
    const { habitId, ...params } = _params
    const response = await this.client.delete(`/notes/${habitId}`, { params })
    return response.data.data
  }

  /**
   * Get all actions for a habit
   */
  async getActions(params: GetActionsParams): Promise<Action[]> {
    const { habitId } = params
    const response = await this.client.get<ApiResponse<Action[]>>(`/actions/${habitId}`)
    return response.data.data
  }

  /**
   * Get a single action by id
   */
  async getAction(params: GetActionParams): Promise<Action> {
    const { habitId, actionId } = params
    const response = await this.client.get<ApiResponse<Action>>(`/actions/${habitId}/${actionId}`)
    return response.data.data
  }

  /**
   * Create a new action for a habit
   */
  async createAction(_params: CreateActionParamsFull): Promise<void> {
    const { habitId, ...params } = _params
    const response = await this.client.post(`/actions/${habitId}`, params)
    return response.data.data
  }

  /**
   * Update an action by id
   */
  async updateAction(_params: UpdateActionParamsFull): Promise<void> {
    const { habitId, actionId, ...params } = _params
    const response = await this.client.put(`/actions/${habitId}/${actionId}`, params)
    return response.data.data
  }

  /**
   * Delete an action by id
   */
  async deleteAction(params: DeleteActionParams): Promise<void> {
    const { habitId, actionId } = params
    const response = await this.client.delete(`/actions/${habitId}/${actionId}`)
    return response.data.data
  }
}
