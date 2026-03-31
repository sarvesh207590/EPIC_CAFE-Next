import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Contact from '@/models/Contact'

export async function POST(request) {
    try {
        await connectDB()

        const body = await request.json()
        const { name, email, message } = body

        // Create new contact message
        const contact = new Contact({
            name,
            email,
            message,
            status: 'unread'
        })

        const savedContact = await contact.save()

        return NextResponse.json({
            success: true,
            message: 'Message sent successfully',
            contactId: savedContact._id,
            contact: savedContact
        })

    } catch (error) {
        console.error('Contact error:', error)

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message)
            return NextResponse.json(
                { success: false, message: 'Validation error', errors },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { success: false, message: 'Failed to send message' },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        await connectDB()

        // Get all contact messages, latest first
        const contacts = await Contact.find().sort({ createdAt: -1 })

        return NextResponse.json({
            success: true,
            contacts,
            count: contacts.length
        })
    } catch (error) {
        console.error('Database error:', error)
        return NextResponse.json(
            { success: false, message: 'Failed to fetch contacts' },
            { status: 500 }
        )
    }
}