import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'

export async function POST(request) {
    try {
        await connectDB()

        const body = await request.json()
        const { foodItem, totalPrice, name, contact, status, quantity, price } = body

        // Create new order
        const order = new Order({
            foodItem,
            price,
            quantity,
            totalPrice,
            customerName: name,
            contact,
            status,
            orderStatus: 'pending'
        })

        const savedOrder = await order.save()

        return NextResponse.json({
            success: true,
            message: 'Order placed successfully',
            orderId: savedOrder._id,
            order: savedOrder
        })

    } catch (error) {
        console.error('Database error:', error)

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message)
            return NextResponse.json(
                { success: false, message: 'Validation error', errors },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { success: false, message: 'Failed to place order' },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        await connectDB()

        // Get the latest order
        const order = await Order.findOne().sort({ createdAt: -1 })

        if (!order) {
            return NextResponse.json(
                { success: false, message: 'No orders found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ success: true, order })
    } catch (error) {
        console.error('Database error:', error)
        return NextResponse.json(
            { success: false, message: 'Failed to fetch order' },
            { status: 500 }
        )
    }
}