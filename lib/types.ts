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
  createdAt: Date
  updatedAt: Date
}
