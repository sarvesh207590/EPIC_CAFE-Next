import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'

export async function GET(request) {
    try {
        await connectDB()

        const { searchParams } = new URL(request.url)
        const contact = searchParams.get('contact')

        if (!contact) {
            return NextResponse.json(
                { success: false, message: 'Contact number is required' },
                { status: 400 }
            )
        }

        // Validate contact number format
        if (!/^[0-9]{10}$/.test(contact)) {
            return NextResponse.json(
                { success: false, message: 'Invalid contact number format' },
                { status: 400 }
            )
        }

        // Find orders by contact number, sorted by creation date (newest first)
        const orders = await Order.find({ contact }).sort({ createdAt: -1 })

        return NextResponse.json({
            success: true,
            orders,
            count: orders.length
        })

    } catch (error) {
        console.error('User orders fetch error:', error)
        return NextResponse.json(
            { success: false, message: 'Failed to fetch orders' },
            { status: 500 }
        )
    }
}