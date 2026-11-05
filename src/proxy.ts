import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './lib/auth'

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers
  })
  const user = session?.user

  if (!user) {
    const loginUrl = new URL('/sign-in', request.url)
    loginUrl.searchParams.set('callbackUrl', `${request.nextUrl.pathname}${request.nextUrl.search}`)
    return NextResponse.redirect(loginUrl)
  }
  return NextResponse.next()
}



export const config = {
  matcher: ['/add-book/:path*', '/my-books/:path*', '/all-books/:path+', '/my-borrows/:path*', '/profile/:path*'],
}
