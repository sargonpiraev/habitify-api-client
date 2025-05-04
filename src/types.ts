export interface HabitifyApiResponse<T> {
  message: string
  data: T
  version: string
  status: boolean
}

export type HabitStatus = 'in_progress' | 'completed' | 'failed' | 'skipped'
export type HabitOrderBy = 'priority' | 'reminder_time' | 'status'

export interface JournalHabitsParams {
  target_date?: string // ISO-8601, URL-encoded if in query
  order_by?: HabitOrderBy
  status?: HabitStatus
  area_id?: string
  time_of_day?: TimeOfDay | TimeOfDay[]
}

export type Periodicity = 'daily' | 'weekly' | 'monthly'

export enum ActionStatus {
  NotDoneYet = 0,
  Done = 1,
}

export enum MoodValue {
  Terrible = 1,
  Bad = 2,
  Okay = 3,
  Good = 4,
  Excellent = 5,
}

export enum NoteType {
  Text = 1,
  Image = 2,
}

export type UnitType =
  | 'kM' | 'm' | 'ft' | 'yd' | 'mi'
  | 'L' | 'mL' | 'fl oz' | 'cup'
  | 'kg' | 'g' | 'mg' | 'oz' | 'lb' | 'mcg'
  | 'sec' | 'min' | 'hr'
  | 'J' | 'kJ' | 'kCal' | 'cal'
  | 'rep'
  | string

export enum LogMethod {
  Manual = 'manual',
  AppleHealth = 'appleHealth',
  GoogleFit = 'googleFit',
  SamsungHealth = 'samsungHealth',
}

export enum TimeOfDay {
  Morning = 'morning',
  Afternoon = 'afternoon',
  Evening = 'evening',
  AnyTime = 'any_time',
}

export interface Goal {
  unit_type: UnitType
  value: number
  periodicity: Periodicity
}

export interface Progress {
  current_value: number
  target_value: number
  unit_type: UnitType
  periodicity: Periodicity
  reference_date: string
}

export interface Area {
  id: string
  name: string
  created_date: string
  priority: string
}

export interface Log {
  id: string
  value: number
  created_date: string
  unit_type: UnitType
  habit_id: string
}

export type HabitStatusType = 'none' | 'in_progress' | 'completed' | 'skipped' | 'failed'
export interface HabitStatusResponse {
  status: HabitStatusType
  progress?: Progress
}

export type UpdateHabitStatus = 'completed' | 'skipped' | 'none'

export interface AddLogRequest {
  unit_type: UnitType
  value: number
  target_date: string // ISO-8601
}

export interface Habit {
  id: string
  name: string
  is_archived: boolean
  start_date: string
  time_of_day: TimeOfDay[]
  goal?: Goal
  goal_history_items?: Goal[]
  log_method: LogMethod
  recurrence: string // RRule string https://github.com/jkbrzt/rrule
  remind?: string[]
  area?: Area | null
  created_date: string
  priority: number
  status?: HabitStatus
  progress?: Progress
}

export interface Mood {
  id: string
  value: MoodValue
  created_at: string
}

export interface CreateMoodRequest {
  value: MoodValue
  created_at: string // ISO-8601
}

export interface UpdateMoodRequest {
  value: MoodValue
  created_at: string // ISO-8601
}

export interface Note {
  id: string
  content: string
  created_date: string
  habit_id: string
  note_type: NoteType
  image_url?: string | null
}

export interface AddTextNoteRequest {
  content: string
  created: string // ISO-8601
}

export interface AddImageNoteRequest {
  image: File | Blob
  created_at: string // ISO-8601
}

export interface DeleteNotesRequest {
  from?: string
  to?: string
}

export interface Action {
  id: string
  remind_at: string
  status: ActionStatus
  title: string
  updated_at: string
  habit_id: string
}

export interface CreateActionRequest {
  title: string
  remind_at: string // ISO-8601
}

export interface UpdateActionRequest {
  status?: ActionStatus
  title?: string
  remind_at?: string // ISO-8601
}
