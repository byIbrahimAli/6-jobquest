export interface JobNotification {
  id: string
  content: string
  completed: boolean
  createdAt: Date
  jobId: string
}

export interface JobApplication {
  id: string
  title: string
  employer: string
  dateApplied: Date | null
  dateInterviewed: Date | null
  category: string
  status: string
  url: string | null
  urlMeta: string | null
  notes: string | null
  customCheck?: boolean
  notifications?: JobNotification[]
  createdAt: Date
  updatedAt: Date
}
