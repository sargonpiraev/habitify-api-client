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
  AddLogParams,
  UpdateHabitStatusParams,
  CreateMoodParams,
  UpdateMoodParams,
  AddTextNoteParams,
  CreateActionParams,
  UpdateActionParams,
} from './types.js'

export class HabitifyApiClient {
  private client: AxiosInstance

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('API key is required')
    }

    this.client = axios.create({
      baseURL: 'https://api.habitify.me/v1',
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
  async getJournal(params?: {
    targetDate?: string
    areaId?: string
    status?: 'in_progress' | 'completed' | 'failed' | 'skipped'
    orderBy?: 'priority' | 'reminder_time' | 'status'
    timeOfDay?:
      | 'morning'
      | 'afternoon'
      | 'evening'
      | 'any_time'
      | Array<'morning' | 'afternoon' | 'evening' | 'any_time'>
  }): Promise<Habit[]> {
    return this.get('/journal', params)
  }

  // Habit methods
  async getHabitStatus(habitId: string, targetDate?: string): Promise<GetHabitStatusResult> {
    const params = targetDate ? { target_date: targetDate } : undefined
    return this.get(`/habits/${habitId}/status`, params)
  }

  async updateHabitStatus(habitId: string, params: UpdateHabitStatusParams): Promise<void> {
    return this.put(`/habits/${habitId}/status`, params)
  }

  // Log methods
  async getLogs(habitId: string, params?: { from?: string; to?: string }): Promise<Log[]> {
    return this.get(`/habits/${habitId}/logs`, params)
  }

  async addLog(habitId: string, params: AddLogParams): Promise<Log> {
    return this.post(`/habits/${habitId}/logs`, params)
  }

  async deleteLog(habitId: string, logId: string): Promise<void> {
    return this.delete(`/habits/${habitId}/logs/${logId}`)
  }

  async deleteLogs(habitId: string, params?: { from?: string; to?: string }): Promise<void> {
    const url = `/habits/${habitId}/logs`
    return this.client.delete(url, { params }).then((res) => res.data)
  }

  // Mood methods
  async getMoods(targetDate?: string): Promise<Mood[]> {
    const params = targetDate ? { target_date: targetDate } : undefined
    return this.get('/moods', params)
  }

  async getMood(moodId: string): Promise<Mood> {
    return this.get(`/moods/${moodId}`)
  }

  async createMood(params: CreateMoodParams): Promise<Mood> {
    return this.post('/moods', params)
  }

  async updateMood(moodId: string, params: UpdateMoodParams): Promise<Mood> {
    return this.put(`/moods/${moodId}`, params)
  }

  async deleteMood(moodId: string): Promise<void> {
    return this.delete(`/moods/${moodId}`)
  }

  // Area methods
  async getAreas(): Promise<Area[]> {
    return this.get('/areas')
  }

  // Note methods
  async getNotes(habitId: string, params?: { from?: string; to?: string }): Promise<Note[]> {
    return this.get(`/habits/${habitId}/notes`, params)
  }

  async addTextNote(habitId: string, params: AddTextNoteParams): Promise<Note> {
    return this.post(`/habits/${habitId}/notes`, params)
  }

  async deleteNote(habitId: string, noteId: string): Promise<void> {
    return this.delete(`/habits/${habitId}/notes/${noteId}`)
  }

  async deleteNotes(habitId: string, params?: { from?: string; to?: string }): Promise<void> {
    const url = `/habits/${habitId}/notes`
    return this.client.delete(url, { params }).then((res) => res.data)
  }

  // Action methods
  async getActions(habitId: string): Promise<Action[]> {
    return this.get(`/habits/${habitId}/actions`)
  }

  async getAction(habitId: string, actionId: string): Promise<Action> {
    return this.get(`/habits/${habitId}/actions/${actionId}`)
  }

  async createAction(habitId: string, params: CreateActionParams): Promise<Action> {
    return this.post(`/habits/${habitId}/actions`, params)
  }

  async updateAction(habitId: string, actionId: string, params: UpdateActionParams): Promise<Action> {
    return this.put(`/habits/${habitId}/actions/${actionId}`, params)
  }

  async deleteAction(habitId: string, actionId: string): Promise<void> {
    return this.delete(`/habits/${habitId}/actions/${actionId}`)
  }
}
