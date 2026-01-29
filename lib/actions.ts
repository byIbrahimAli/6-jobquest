'use server'

import { prisma } from './db'
import * as cheerio from 'cheerio'
import { revalidatePath } from 'next/cache'
import { JobApplication } from '@/lib/types'

export async function getJobs() {
  return await prisma.jobApplication.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

export async function createJob(data: {
  title: string
  employer: string
  category?: string
  status?: string
  dateApplied?: Date | string | null
  dateInterviewed?: Date | string | null
  url?: string
  urlMeta?: string
  notes?: string
}) {
  const job = await prisma.jobApplication.create({
    data: {
      title: data.title,
      employer: data.employer,
      category: data.category || 'General',
      status: data.status || 'Interested',
      dateApplied: data.dateApplied ? new Date(data.dateApplied) : null,
      dateInterviewed: data.dateInterviewed ? new Date(data.dateInterviewed) : null,
      url: data.url,
      urlMeta: data.urlMeta,
      notes: data.notes
    }
  })
  revalidatePath('/')
  return job
}

export async function updateJob(id: string, data: Partial<JobApplication> & { dateApplied?: Date | string | null; dateInterviewed?: Date | string | null }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: any = { ...data }
  if (data.dateApplied !== undefined) {
      updateData.dateApplied = data.dateApplied ? new Date(data.dateApplied) : null
  }
  if (data.dateInterviewed !== undefined) {
      updateData.dateInterviewed = data.dateInterviewed ? new Date(data.dateInterviewed) : null
  }

  const job = await prisma.jobApplication.update({
    where: { id },
    data: updateData
  })
  revalidatePath('/')
  return job
}

export async function deleteJob(id: string) {
  await prisma.jobApplication.delete({ where: { id } })
  revalidatePath('/')
}

export async function fetchUrlMetadata(url: string) {
  if (!url) return null
  try {
    const res = await fetch(url, { 
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; JobQuest/1.0)' },
      next: { revalidate: 3600 } 
    })
    if (!res.ok) return null
    const html = await res.text()
    const $ = cheerio.load(html)
    
    const title = $('meta[property="og:title"]').attr('content') || $('title').text() || ''
    const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || ''
    const image = $('meta[property="og:image"]').attr('content') || ''
    
    return { title, description, image }
  } catch (error) {
    console.error('Error fetching metadata:', error)
    return null
  }
}
