import { render, screen } from '@testing-library/react'
import { JobBlock } from './JobBlock'
import { JobApplication } from '@/lib/types'

// Mock server actions
jest.mock('@/lib/actions', () => ({
  updateJob: jest.fn(),
  deleteJob: jest.fn(),
  fetchUrlMetadata: jest.fn(),
}))

const mockJob: JobApplication = {
  id: '1',
  title: 'Software Engineer',
  employer: 'Tech Corp',
  status: 'Applied',
  dateApplied: new Date('2024-01-01'),
  dateInterviewed: null,
  category: 'Engineering',
  url: '',
  urlMeta: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('JobBlock', () => {
  it('renders correctly', () => {
    render(<JobBlock job={mockJob} />)
    
    // Check if main fields are present
    expect(screen.getByDisplayValue('Software Engineer')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Tech Corp')).toBeInTheDocument()
    
    
    // Check if status badge is present (Applied appears twice: label and status)
    expect(screen.getAllByText('Applied').length).toBeGreaterThanOrEqual(1)
  })

  it('shows copy button for interview date when present', () => {
      const interviewJob = { 
          ...mockJob, 
          dateInterviewed: new Date('2024-02-15') 
      }
      render(<JobBlock job={interviewJob} />)
      
      // Verify date display
      // Depending on locale, '2024-02-15' might render variously. 
      // The input value uses YYYY-MM-DD
      expect(screen.getByDisplayValue('2024-02-15')).toBeInTheDocument()
      
      // Verify CopyButton presence. CopyButton has aria-label or accessible text?
      // My CopyButton implementation has <span className="sr-only">{label}</span>
      // label defaults to "Copy", but I passed "Copy Date" for dates.
      
      // We should look for "Copy Date" hidden text
      const copyButtons = screen.getAllByText('Copy Date')
      expect(copyButtons.length).toBeGreaterThan(0)
  })
})
