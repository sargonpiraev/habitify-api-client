/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance } from 'axios'
import type {
  Habit,
  GetHabitStatusResult,
  Log,
  Mood,
  Area,
  Note,
  Action,
  GetJournalParams,
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
  GetAreasParams,
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

export class HabitifyApiClient {
  private client: AxiosInstance

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('API key is required')
    }

    this.client = axios.create({
      baseURL: 'https://api.habitify.me',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    })
  }

  // Raw HTTP methods for flexibility
  async get<T = any>(url: string, params?: any): Promise<T> {
    const response = await this.client.get(url, { params })
    return response.data
  }

  async post<T = any>(url: string, data?: any): Promise<T> {
    const response = await this.client.post(url, data)
    return response.data
  }

  async put<T = any>(url: string, data?: any): Promise<T> {
    const response = await this.client.put(url, data)
    return response.data
  }

  async delete<T = any>(url: string): Promise<T> {
    const response = await this.client.delete(url)
    return response.data
  }

  // Journal methods
  async getJournal(params?: GetJournalParams): Promise<Habit[]> {
    return this.get('/journal', params)
  }

  // Habit methods
  async getHabitStatus(params: GetHabitStatusParams): Promise<GetHabitStatusResult> {
    const { habit_id, target_date } = params
    const queryParams = target_date ? { target_date } : undefined
    return this.get(`/habits/${habit_id}/status`, queryParams)
  }

  async updateHabitStatus(params: UpdateHabitStatusParams): Promise<void> {
    const { habit_id, ...updateData } = params
    return this.put(`/habits/${habit_id}/status`, updateData)
  }

  // Log methods
  async getLogs(params: GetLogsParams): Promise<Log[]> {
    const { habit_id, ...queryParams } = params
    return this.get(`/habits/${habit_id}/logs`, queryParams)
  }

  async addLog(params: AddLogParamsFull): Promise<Log> {
    const { habit_id, ...logData } = params
    return this.post(`/habits/${habit_id}/logs`, logData)
  }

  async deleteLog(params: DeleteLogParams): Promise<void> {
    const { habit_id, log_id } = params
    return this.delete(`/habits/${habit_id}/logs/${log_id}`)
  }

  async deleteLogs(params: DeleteLogsParamsFull): Promise<void> {
    const { habit_id, ...queryParams } = params
    const url = `/habits/${habit_id}/logs`
    return this.client.delete(url, { params: queryParams }).then((res) => res.data)
  }

  // Mood methods
  async getMoods(params?: GetMoodsParams): Promise<Mood[]> {
    return this.get('/moods', params)
  }

  async getMood(params: GetMoodParams): Promise<Mood> {
    const { mood_id } = params
    return this.get(`/moods/${mood_id}`)
  }

  async createMood(params: CreateMoodParamsFull): Promise<Mood> {
    return this.post('/moods', params)
  }

  async updateMood(params: UpdateMoodParamsFull): Promise<Mood> {
    const { mood_id, ...updateData } = params
    return this.put(`/moods/${mood_id}`, updateData)
  }

  async deleteMood(params: DeleteMoodParams): Promise<void> {
    const { mood_id } = params
    return this.delete(`/moods/${mood_id}`)
  }

  // Area methods
  async getAreas(params?: GetAreasParams): Promise<Area[]> {
    return this.get('/areas', params)
  }

  // Note methods
  async getNotes(params: GetNotesParams): Promise<Note[]> {
    const { habit_id, ...queryParams } = params
    return this.get(`/habits/${habit_id}/notes`, queryParams)
  }

  async addTextNote(params: AddTextNoteParamsFull): Promise<Note> {
    const { habit_id, ...noteData } = params
    return this.post(`/habits/${habit_id}/notes`, noteData)
  }

  async addImageNote(params: AddImageNoteParamsFull): Promise<Note> {
    const { habit_id, image, created_at } = params
    const formData = new FormData()
    formData.append('image', image)
    formData.append('created_at', created_at)

    const response = await this.client.post(`/habits/${habit_id}/notes`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }

  async deleteNote(params: DeleteNoteParams): Promise<void> {
    const { habit_id, note_id } = params
    return this.delete(`/habits/${habit_id}/notes/${note_id}`)
  }

  async deleteNotes(params: DeleteNotesParamsFull): Promise<void> {
    const { habit_id, ...queryParams } = params
    const url = `/habits/${habit_id}/notes`
    return this.client.delete(url, { params: queryParams }).then((res) => res.data)
  }

  // Action methods
  async getActions(params: GetActionsParams): Promise<Action[]> {
    const { habit_id } = params
    return this.get(`/habits/${habit_id}/actions`)
  }

  async getAction(params: GetActionParams): Promise<Action> {
    const { habit_id, action_id } = params
    return this.get(`/habits/${habit_id}/actions/${action_id}`)
  }

  async createAction(params: CreateActionParamsFull): Promise<Action> {
    const { habit_id, ...actionData } = params
    return this.post(`/habits/${habit_id}/actions`, actionData)
  }

  async updateAction(params: UpdateActionParamsFull): Promise<Action> {
    const { habit_id, action_id, ...updateData } = params
    return this.put(`/habits/${habit_id}/actions/${action_id}`, updateData)
  }

  async deleteAction(params: DeleteActionParams): Promise<void> {
    const { habit_id, action_id } = params
    return this.delete(`/habits/${habit_id}/actions/${action_id}`)
  }
}
