import { render, screen } from '@testing-library/react'
import { RecentActivity } from './RecentActivity'
import { JobApplication } from '@/lib/types'

const mockJobs: JobApplication[] = [
  {
    id: '1',
    title: 'Job 1',
    employer: 'Company A',
    status: 'Applied',
    dateApplied: new Date(),
    dateInterviewed: null,
    category: 'General',
    url: '',
    urlMeta: null,
    updatedAt: new Date(),
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Job 2',
    employer: 'Company B',
    status: 'Interviewing',
    dateApplied: new Date(),
    dateInterviewed: null,
    category: 'General',
    url: '',
    urlMeta: null,
    updatedAt: new Date(Date.now() - 86400000), // 1 day ago
    createdAt: new Date(),
  },
]

describe('RecentActivity', () => {
  it('renders recent jobs correctly', () => {
    render(<RecentActivity jobs={mockJobs} />)
    
    expect(screen.getByText('Recent Activity')).toBeInTheDocument()
    expect(screen.getByText('Job 1')).toBeInTheDocument()
    expect(screen.getByText('Company A')).toBeInTheDocument()
    expect(screen.getByText('Job 2')).toBeInTheDocument()
  })

  it('renders empty state when no jobs provided', () => {
    render(<RecentActivity jobs={[]} />)
    expect(screen.getByText('No recent activity')).toBeInTheDocument()
  })

  it('handles client-side date rendering without crashing', () => {
    render(<RecentActivity jobs={mockJobs} />)
    // The main check here is that it renders. 
    // We can check if "ago" text is present which implies the client-side logic ran.
    // Note: exact time might vary, just checking partial match or existence.
    const timeElements = screen.getAllByText(/ago/i)
    expect(timeElements.length).toBeGreaterThan(0)
  })
})
