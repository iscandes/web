import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    env_vars: {
      DB_HOST: process.env.DB_HOST || 'UNDEFINED',
      DB_USER: process.env.DB_USER || 'UNDEFINED', 
      DB_PASSWORD: process.env.DB_PASSWORD ? '***HIDDEN***' : 'UNDEFINED',
      DB_NAME: process.env.DB_NAME || 'UNDEFINED',
      DB_PORT: process.env.DB_PORT || 'UNDEFINED',
      NODE_ENV: process.env.NODE_ENV || 'UNDEFINED'
    },
    message: 'Environment variables from Next.js API'
  });
}