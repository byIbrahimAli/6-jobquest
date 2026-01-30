
import { render, screen, fireEvent } from '@testing-library/react'
import { CustomCheckbox } from './CustomCheckbox'

describe('CustomCheckbox', () => {
  it('renders correctly in default state (No/Red)', () => {
    const onToggle = jest.fn()
    render(<CustomCheckbox checked={false} onToggle={onToggle} />)
    
    const checkbox = screen.getByRole('button', { name: "Toggle to Yes" })
    expect(checkbox).toBeInTheDocument()
    // Verify styling (Red)
    expect(checkbox).toHaveStyle({ backgroundColor: '#ef4444' })
  })

  it('renders correctly in checked state (Yes/Green)', () => {
    const onToggle = jest.fn()
    render(<CustomCheckbox checked={true} onToggle={onToggle} />)
    
    const checkbox = screen.getByRole('button', { name: "Toggle to No" })
    expect(checkbox).toBeInTheDocument()
    // Verify styling (Green)
    expect(checkbox).toHaveStyle({ backgroundColor: '#22c55e' })
  })

  it('calls onToggle when clicked', () => {
    const onToggle = jest.fn()
    render(<CustomCheckbox checked={false} onToggle={onToggle} />)
    
    const checkbox = screen.getByRole('button')
    fireEvent.click(checkbox)
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is passed', () => {
    const onToggle = jest.fn()
    render(<CustomCheckbox checked={false} onToggle={onToggle} disabled={true} />)
    
    const checkbox = screen.getByRole('button')
    expect(checkbox).toBeDisabled()
    
    fireEvent.click(checkbox)
    expect(onToggle).not.toHaveBeenCalled()
  })
})
