import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { JobQuestApp } from './JobQuestApp'
import { JobApplication } from '@/lib/types'

// Not mocking modules globally if we can avoid it, but let's stick to the pattern.
jest.mock('@/lib/actions', () => ({
  createJob: jest.fn(),
  updateJob: jest.fn(),
  deleteJob: jest.fn(),
}))

// Mock UI Select components to avoid Radix UI pointer event issues in JSDOM
jest.mock('@/components/ui/select', () => ({
  Select: ({ value, onValueChange, children }: any) => (
    <div data-testid="mock-select">
      <select
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          aria-label="Status"
      >
        {children}
      </select>
    </div>
  ),
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: () => null,
  SelectContent: ({ children }: any) => <>{children}</>,
  SelectItem: ({ value, children }: any) => (
      <option value={value}>{value}</option> // Simplify children for option text
  ),
}))

const mockJobs: JobApplication[] = [
  {
    id: '1',
    title: 'Frontend Dev',
    employer: 'Google',
    status: 'Applied',
    category: 'Engineering',
    dateApplied: new Date(),
    dateInterviewed: null,
    url: '',
    urlMeta: null,
    updatedAt: new Date(),
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Backend Dev',
    employer: 'Amazon',
    status: 'Interested',
    category: 'Engineering',
    dateApplied: new Date(),
    dateInterviewed: null,
    url: '',
    urlMeta: null,
    updatedAt: new Date(),
    createdAt: new Date(),
  },
]

describe('JobQuestApp', () => {
  it('renders dashboard components', () => {
    render(<JobQuestApp jobs={mockJobs} />)
    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('Frontend Dev')).toBeInTheDocument()
    expect(screen.getByText('Backend Dev')).toBeInTheDocument()
  })

  it('filters jobs by status', async () => {
    const user = userEvent.setup()
    render(<JobQuestApp jobs={mockJobs} />)

    // Default shows all
    expect(screen.getByDisplayValue('Frontend Dev')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Backend Dev')).toBeInTheDocument()

    const selects = screen.getAllByRole('combobox') // <select> has implicit role combobox
    const statusSelect = selects[0] // First is Status

    // Select 'Applied'
    await user.selectOptions(statusSelect, 'Applied')

    // Now filtering should be applied.
    // 'Backend Dev' is in the filtered-out list (EditorInterface), so it should generally disappear from THERE.
    // Note: It might still be in RecentActivity (unfiltered).
    // JobBlock uses inputs with values, RecentActivity uses text.
    await waitFor(() => {
       expect(screen.getByDisplayValue('Frontend Dev')).toBeInTheDocument()
       expect(screen.queryByDisplayValue('Backend Dev')).not.toBeInTheDocument()
    })
  })
})
