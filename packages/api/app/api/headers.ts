export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export const KONG_API_HEADERS = {
  'Content-Type': 'application/json',
  auth: process.env.KONG_API_AUTH ?? '',
}
