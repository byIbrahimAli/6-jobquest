
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { JobBlock } from './JobBlock'
import { JobApplication } from '@/lib/types'
import { updateJob } from '@/lib/actions'

// Mock generic Alert Dialog parts to render children directly
jest.mock('@/components/ui/alert-dialog', () => ({
  AlertDialog: ({ children }: any) => <div>{children}</div>,
  AlertDialogTrigger: ({ children }: any) => <div>{children}</div>,
  AlertDialogContent: ({ children }: any) => <div>{children}</div>,
  AlertDialogHeader: ({ children }: any) => <div>{children}</div>,
  AlertDialogTitle: ({ children }: any) => <div>{children}</div>,
  AlertDialogDescription: ({ children }: any) => <div>{children}</div>,
  AlertDialogFooter: ({ children }: any) => <div>{children}</div>,
  AlertDialogCancel: ({ children }: any) => <button>{children}</button>,
  AlertDialogAction: ({ children }: any) => <button>{children}</button>,
}))

// Mock Copy Button and others
jest.mock('@/components/ui/copy-button', () => ({
  CopyButton: () => <button>Copy</button>
}))
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, title, className, ...props }: any) => (
    <button onClick={onClick} title={title} className={className} {...props}>
      {children}
    </button>
  )
}))

// Mock Actions
jest.mock('@/lib/actions', () => ({
  updateJob: jest.fn(),
  fetchUrlMetadata: jest.fn().mockResolvedValue({ title: 'Meta Title', description: 'Meta Desc' }),
  deleteJob: jest.fn()
}))

// Mock Timer
jest.useFakeTimers()

const mockJob: JobApplication = {
  id: 'test-id',
  title: 'Test Job',
  employer: 'Test Corp',
  status: 'Applying',
  category: 'Engineering',
  dateApplied: new Date('2024-01-01'),
  dateInterviewed: null,
  url: 'https://example.com',
  urlMeta: '{"title":"Example","description":"Desc"}',
  notes: 'Existing note',
  customCheck: false,
  createdAt: new Date(),
  updatedAt: new Date()
}

describe('JobBlock', () => {
  it('renders correctly', () => {
    render(<JobBlock job={mockJob} />)
    expect(screen.getByDisplayValue('Test Job')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test Corp')).toBeInTheDocument()
  })

  
  it('shows notes if they exist', () => {
      render(<JobBlock job={mockJob} />)
      expect(screen.getByDisplayValue('Existing note')).toBeInTheDocument()
  })

  it('updates notes when typing', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<JobBlock job={mockJob} />)
      
      const textarea = screen.getByDisplayValue('Existing note')
      await user.clear(textarea)
      await user.type(textarea, 'Updated note content')
      
      expect(screen.getByDisplayValue('Updated note content')).toBeInTheDocument()
  })
  
  it('deletes note when trash clicked', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<JobBlock job={mockJob} />)
      
      const clearButton = screen.getByTitle('Clear Note')
      await user.click(clearButton)
      
      expect(screen.queryByDisplayValue('Existing note')).not.toBeInTheDocument()
  })

  it('toggles notes section', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<JobBlock job={{ ...mockJob, notes: null }} />)
  })

  it('toggles URL edit mode', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<JobBlock job={mockJob} />) // Has URL
      
      // Should show card (edit button present), not input initially
      expect(screen.queryByPlaceholderText('Paste Job URL (auto-scrapes)')).not.toBeInTheDocument()
      
      // Click Edit
      const editButton = screen.getByTitle('Edit URL')
      await user.click(editButton)
      
      // Should show input now
      const input = screen.getByPlaceholderText('Paste Job URL (auto-scrapes)')
      expect(input).toBeInTheDocument()
      // Local state should start with DB value
      expect(input).toHaveValue('https://example.com')
      
      // Blur to save/close
      fireEvent.blur(input)
      
      // Should revert to card
      expect(screen.queryByPlaceholderText('Paste Job URL (auto-scrapes)')).not.toBeInTheDocument()
  })

  it('updates title on change', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<JobBlock job={mockJob} />)
    
    // Find Title Input - it has "Job Title" placeholder
    const input = screen.getByPlaceholderText('Job Title') // Changed from DisplayValue to Placeholder for stability if initial is generic, or DisplayValue if known.
    // Actually mockJob has 'Test Job'.
    // const input = screen.getByDisplayValue('Test Job') 
    
    await user.clear(input)
    await user.type(input, 'New Title')
    
    expect(input).toHaveValue('New Title')
    // Verify debounce if we can mock actions?
    // updateJob shouldn't be called immediately
    // expect(updateJob).not.toHaveBeenCalled()
    // jest.advanceTimersByTime(500)
    // expect(updateJob).toHaveBeenCalledWith('test-id', { title: 'New Title' })
  })

  it('updates employer on change', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<JobBlock job={mockJob} />)
    
    const input = screen.getByPlaceholderText('Company')
    await user.clear(input)
    await user.type(input, 'New Corp')
    
    expect(input).toHaveValue('New Corp')
  })

  it('updates category on change', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<JobBlock job={mockJob} />)
    
    const input = screen.getByDisplayValue('Engineering')
    await user.clear(input)
    await user.type(input, 'Management')
    
    expect(input).toHaveValue('Management')
  })

  it('toggles custom checkbox', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<JobBlock job={mockJob} />)
    
    // Default is false (red) -> "Marked: No"
    const checkbox = screen.getByRole('button', { name: "Toggle to Yes" })
    expect(checkbox).toBeInTheDocument()
    
    // Click to toggle
    await user.click(checkbox)
    
    // Expect toggle call
    // Logic: it updates local state immediately, then debounces updateJob
    // We check if title changed or if we can spy on updateJob
    jest.advanceTimersByTime(500)
    expect(updateJob).toHaveBeenCalledWith('test-id', { customCheck: true })
  })
})
