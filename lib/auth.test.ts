import { login } from './auth'
import { redirect } from 'next/navigation'

// Mock dependencies
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => Promise.resolve({
    set: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

describe('login action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockFormData = new FormData()
  mockFormData.append('password', 'password')

  it('should handle useActionState signature (prevState, formData)', async () => {
    // This is the call signature useActionState uses: (prevState, formData)
    // Currently this will fail because login expects (formData)
    
    // We expect the function to eventually handle:
    const prevState = { error: '' }
    
    // We are testing that the function CAN accept this signature.
    // In strict TDD, we might assert failure first, but for this task I will
    // strictly write the test that expects SUCCESS on the correct signature,
    // and then fix the code to make it pass.
    
    // However, TypeScript might complain if I call with 2 args and it defines 1.
    // So I will cast to any for the test to simulate the runtime behavior.
    
    // Real env password is 'password' from our previous step
    process.env.APP_PASSWORD = 'password'
    
    // @ts-ignore
    await login(prevState, mockFormData)
    
    // If successful, it should redirect
    expect(redirect).toHaveBeenCalledWith('/')
  })

  it('should return error for invalid password', async () => {
    const prevState = { error: '' }
    const badFormData = new FormData()
    badFormData.append('password', 'wrong')
    
    // @ts-ignore
    const result = await login(prevState, badFormData)
    
    expect(result).toEqual({ error: 'Invalid password' })
    expect(redirect).not.toHaveBeenCalled()
  })
})
