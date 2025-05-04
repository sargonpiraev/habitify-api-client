import axios, { AxiosInstance } from "axios";

// API Response Wrapper
export interface HabitifyApiResponse<T> {
  message: string;
  data: T;
  version: string;
  status: boolean;
}

// Enums and types for Journal filters
export type HabitStatus = 'in_progress' | 'completed' | 'failed' | 'skipped';
export type HabitOrderBy = 'priority' | 'reminder_time' | 'status';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'any_time';

export interface JournalHabitsParams {
  target_date?: string; // ISO-8601, URL-encoded if in query
  order_by?: HabitOrderBy;
  status?: HabitStatus;
  area_id?: string;
  time_of_day?: TimeOfDay | TimeOfDay[];
}

// Goal, Progress, Area, Log, LogMethod, UnitType, Periodicity
export type Periodicity = 'daily' | 'weekly' | 'monthly';
export type UnitType = 'min' | 'step' | 'rep' | 'kM' | string; // расширяемый тип
export type LogMethod = 'manual' | 'auto' | string;

export interface Goal {
  unit_type: UnitType;
  value: number;
  periodicity: Periodicity;
}

export interface Progress {
  current_value: number;
  target_value: number;
  unit_type: UnitType;
  periodicity: Periodicity;
  reference_date: string;
}

export interface Area {
  id: string;
  name: string;
  priority: string;
}

export interface Log {
  id: string;
  value: number;
  created_date: string;
  unit_type: UnitType;
  habit_id: string;
}

// HabitStatusResponse для /status/:habit_id
export type HabitStatusType = 'none' | 'in_progress' | 'completed' | 'skipped' | 'failed';
export interface HabitStatusResponse {
  status: HabitStatusType;
  progress?: Progress;
}

export type UpdateHabitStatus = 'completed' | 'skipped' | 'none';

export interface AddLogRequest {
  unit_type: UnitType;
  value: number;
  target_date: string; // ISO-8601
}

// Habit type (based on API example)
export interface Habit {
  id: string;
  name: string;
  is_archived: boolean;
  start_date: string;
  time_of_day: TimeOfDay[];
  goal?: Goal;
  goal_history_items?: Goal[];
  log_method: LogMethod;
  recurrence: string;
  remind?: string[];
  area?: Area | null;
  created_date: string;
  priority: number;
  status?: HabitStatus; // только при получении из журнала
  progress?: Progress; // только если статус in_progress/completed/skipped
}

class HabitifyApiClient {
    private client: AxiosInstance;

    constructor(private readonly apiKey: string) {
      this.client = axios.create({
        baseURL: 'https://api.habitify.me',
        headers: { 'Authorization': this.apiKey }
      });
    }

    async getUser() {
        const response = await this.client.get(`/user`);
        return response.data;
    }

    /**
     * Get habits from the journal with optional filters
     * @param params JournalHabitsParams
     */
    async getJournalHabits(params?: JournalHabitsParams): Promise<Habit[]> {
      const query: Record<string, string> = {};
      if (params) {
        if (params.target_date) query.target_date = encodeURIComponent(params.target_date);
        if (params.order_by) query.order_by = params.order_by;
        if (params.status) query.status = params.status;
        if (params.area_id) query.area_id = params.area_id;
        if (params.time_of_day) {
          query.time_of_day = Array.isArray(params.time_of_day)
            ? params.time_of_day.join(',')
            : params.time_of_day;
        }
      }
      const search = Object.keys(query).length > 0 ? `?${Object.entries(query).map(([k,v]) => `${k}=${v}`).join('&')}` : '';
      const response = await this.client.get<HabitifyApiResponse<Habit[]>>(`/journal${search}`);
      return response.data.data;
    }

    /**
     * Get habit status for a specific date
     */
    async getHabitStatus(habitId: string, target_date?: string): Promise<HabitStatusResponse> {
      const params = target_date ? `?target_date=${encodeURIComponent(target_date)}` : '';
      const response = await this.client.get<HabitifyApiResponse<HabitStatusResponse>>(`/status/${habitId}${params}`);
      return response.data.data;
    }

    /**
     * Update habit status for a specific date
     */
    async updateHabitStatus(habitId: string, status: UpdateHabitStatus, target_date: string): Promise<void> {
      await this.client.put(`/status/${habitId}`, { status, target_date });
    }

    /**
     * Get logs for a habit
     */
    async getLogs(habitId: string, params?: { from?: string; to?: string }): Promise<Log[]> {
      let query = '';
      if (params) {
        const q: string[] = [];
        if (params.from) q.push(`from=${encodeURIComponent(params.from)}`);
        if (params.to) q.push(`to=${encodeURIComponent(params.to)}`);
        if (q.length) query = '?' + q.join('&');
      }
      const response = await this.client.get<HabitifyApiResponse<Log[]>>(`/logs/${habitId}${query}`);
      return response.data.data;
    }

    /**
     * Add a log for a habit
     */
    async addLog(habitId: string, data: AddLogRequest): Promise<void> {
      await this.client.post(`/logs/${habitId}`, data);
    }

    /**
     * Delete a single log by id
     */
    async deleteLog(habitId: string, logId: string): Promise<void> {
      await this.client.delete(`/logs/${habitId}/${logId}`);
    }

    /**
     * Delete logs for a habit in a date range
     */
    async deleteLogs(habitId: string, params?: { from?: string; to?: string }): Promise<void> {
      let query = '';
      if (params) {
        const q: string[] = [];
        if (params.from) q.push(`from=${encodeURIComponent(params.from)}`);
        if (params.to) q.push(`to=${encodeURIComponent(params.to)}`);
        if (q.length) query = '?' + q.join('&');
      }
      await this.client.delete(`/logs/${habitId}${query}`);
    }
}

export default HabitifyApiClient;

