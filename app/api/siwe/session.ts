import { SiweResponse } from 'siwe'

export type SessionData = {
  nonce: string
  siwe?: SiweResponse
}

export const sessionOptions = {
  cookieName: 'siwe',
  password: 'complex_password_at_least_32_characters_long',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  }
}
