'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function login(prevState: any, formData: FormData) {
  const password = formData.get('password') as string
  const correctPassword = process.env.APP_PASSWORD

  if (password === correctPassword) {
    const cookieStore = await cookies()
    cookieStore.set('session_auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    })
    redirect('/')
  } else {
    return { error: 'Invalid password' }
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('session_auth')
  redirect('/login')
}
