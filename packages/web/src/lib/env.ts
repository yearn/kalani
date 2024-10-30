export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'
if (!API_URL) { throw new Error('🤬 VITE_API_URL environment variable is not set') }

export const KONG_GQL_URL = import.meta.env.VITE_KONG_GQL
if (!KONG_GQL_URL) { throw new Error('🤬 VITE_KONG_GQL environment variable is not set') }
