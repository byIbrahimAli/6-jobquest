
import { render, screen, fireEvent } from '@testing-library/react'
import { JobQuestApp } from './JobQuestApp'
import { JobApplication } from '@/lib/types'

// Mock dependencies
jest.mock('@/components/dashboard/DashboardHeader', () => ({
  DashboardHeader: () => <div data-testid="dashboard-header">Header</div>
}))
jest.mock('@/components/editor/EditorInterface', () => ({
  EditorInterface: ({ viewMode, jobs }: any) => (
    <div data-testid="editor-interface">
      Mode: {viewMode} | Jobs: {jobs.length}
    </div>
  )
}))
// Mock Select (Radix) which might be hard to test in unit tests without extensive mocking
jest.mock('@/components/ui/select', () => ({
  Select: ({ children }: any) => <div>{children}</div>,
  SelectTrigger: ({ children }: any) => <button>{children}</button>,
  SelectValue: () => <span>Value</span>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children }: any) => <div>{children}</div>,
}))
jest.mock('@/components/ThemeToggle', () => ({
  ThemeToggle: () => <button>Theme</button>
}))

const mockJobs: JobApplication[] = [
  {
    id: '1',
    title: 'Dev',
    employer: 'Google',
    status: 'Applied',
    category: 'Tech',
    createdAt: new Date(),
    updatedAt: new Date(),
    customCheck: false
  },
  {
    id: '2',
    title: 'Designer',
    employer: 'Apple',
    status: 'Interested',
    category: 'Design',
    createdAt: new Date(),
    updatedAt: new Date(),
    customCheck: true 
  }
]

describe('JobQuestApp', () => {
  it('renders correctly and toggles view mode', () => {
    render(<JobQuestApp jobs={mockJobs} />)

    // Check Header and Editor present
    expect(screen.getByTestId('dashboard-header')).toBeInTheDocument()
    expect(screen.getByTestId('editor-interface')).toHaveTextContent('Mode: detailed')

    // Find custom toggle buttons
    const detailedBtn = screen.getByText('Detailed')
    const conciseBtn = screen.getByText('Concise')

    // Click Concise
    fireEvent.click(conciseBtn)
    expect(screen.getByTestId('editor-interface')).toHaveTextContent('Mode: concise')
    
    // Check styling classes (active state) logic implicitly via behavior, 
    // but explicit class check:
    expect(conciseBtn).toHaveClass('bg-background') 

    // Click Detailed
    fireEvent.click(detailedBtn)
    expect(screen.getByTestId('editor-interface')).toHaveTextContent('Mode: detailed')
  })
})
