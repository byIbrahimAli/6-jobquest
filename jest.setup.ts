import '@testing-library/jest-dom'

// Mock ResizeObserver for Radix UI
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}


window.ResizeObserver = ResizeObserver

window.HTMLElement.prototype.scrollIntoView = jest.fn()
window.HTMLElement.prototype.releasePointerCapture = jest.fn()
window.HTMLElement.prototype.hasPointerCapture = jest.fn() // as any
window.HTMLElement.prototype.setPointerCapture = jest.fn()


