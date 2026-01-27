import { getJobs } from "@/lib/actions"
import { JobQuestApp } from "@/components/JobQuestApp"

export default async function Page() {
  const jobs = await getJobs()
  return <JobQuestApp jobs={jobs} />
}
