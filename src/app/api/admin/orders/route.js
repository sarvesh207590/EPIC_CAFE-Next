import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import Transaction from '@/models/Transaction'
import jwt from 'jsonwebtoken'

// Middleware to check admin authentication
function checkAdminAuth(request) {
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
        throw new Error('No admin token provided')
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-here')

    if (decoded.role !== 'admin') {
        throw new Error('Not authorized as admin')
    }

    return decoded
}

export async function GET(request) {
    try {
        // Check admin authentication
        checkAdminAuth(request)

        await connectDB()

        // Only return today's orders
        const startOfDay = new Date()
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date()
        endOfDay.setHours(23, 59, 59, 999)

        const orders = await Order.find({
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ createdAt: -1 })

        // Attach transaction ID to each order for staff verification
        const orderIds = orders.map(o => o._id)
        const transactions = await Transaction.find({ orderId: { $in: orderIds } })
        const txnMap = {}
        transactions.forEach(t => { txnMap[t.orderId?.toString()] = t.transactionId })

        const ordersWithTxn = orders.map(o => ({
            ...o.toObject(),
            transactionId: txnMap[o._id.toString()] || null
        }))

        return NextResponse.json({
            success: true,
            orders: ordersWithTxn,
            count: ordersWithTxn.length
        })

    } catch (error) {
        console.error('Admin orders fetch error:', error)

        if (error.message.includes('token') || error.message.includes('admin')) {
            return NextResponse.json(
                { success: false, message: error.message },
                { status: 401 }
            )
        }

        return NextResponse.json(
            { success: false, message: 'Failed to fetch orders' },
            { status: 500 }
        )
    }
}

export async function PUT(request) {
    try {
        // Check admin authentication
        checkAdminAuth(request)

        await connectDB()

        const body = await request.json()
        const { orderId, status } = body

        if (!orderId || !status) {
            return NextResponse.json(
                { success: false, message: 'Order ID and status are required' },
                { status: 400 }
            )
        }

        // Valid order statuses
        const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']

        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { success: false, message: 'Invalid order status' },
                { status: 400 }
            )
        }

        // Update order status
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { orderStatus: status, updatedAt: new Date() },
            { new: true }
        )

        if (!updatedOrder) {
            return NextResponse.json(
                { success: false, message: 'Order not found' },
                { status: 404 }
            )
        }

        // Send notification to customer (simulate)
        try {
            await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/notifications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: updatedOrder._id,
                    status: status,
                    customerContact: updatedOrder.contact
                })
            })
        } catch (notificationError) {
            console.log('Notification sending failed:', notificationError.message)
            // Don't fail the order update if notification fails
        }

        return NextResponse.json({
            success: true,
            message: 'Order status updated successfully',
            order: updatedOrder
        })

    } catch (error) {
        console.error('Admin order update error:', error)

        if (error.message.includes('token') || error.message.includes('admin')) {
            return NextResponse.json(
                { success: false, message: error.message },
                { status: 401 }
            )
        }

        return NextResponse.json(
            { success: false, message: 'Failed to update order status' },
            { status: 500 }
        )
    }
}