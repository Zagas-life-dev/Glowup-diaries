import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { to, subject, content } = await request.json()
    
    console.log('Attempting to send email:', { to, subject, content })
    console.log('Using Resend API Key:', process.env.RESEND_API_KEY ? 'Present' : 'Missing')

    if (!process.env.RESEND_API_KEY) {
      throw new Error('Resend API key is not configured')
    }

    const data = await resend.emails.send({
      from: 'Glow Up Diaries <support@glowupdiaries.com>',
      to: [to],
      subject: subject,
      html: content,
    })

    console.log('Email sent successfully:', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to send email:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    }, { status: 500 })
  }
}