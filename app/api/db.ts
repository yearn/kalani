import { db as vercelDb } from '@vercel/postgres'
import { Pool } from 'pg'

function getDb() {
  if (!process.env.VERCEL_ENV) { // if dev
    return new Pool({
      host: process.env.POSTGRES_HOST || 'localhost',
      port: (process.env.POSTGRES_PORT || 5432) as number,
      ssl: process.env.POSTGRES_SSL === 'true',
      database: process.env.POSTGRES_DATABASE || 'user',
      user: process.env.POSTGRES_USER || 'user',
      password: process.env.POSTGRES_PASSWORD || 'password'
    })
  } else {
    return vercelDb
  }
}

export const db = getDb()
