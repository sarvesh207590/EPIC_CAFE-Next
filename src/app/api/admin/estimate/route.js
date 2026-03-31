import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'

export async function GET() {
    try {
        await connectDB()

        // Get current queue statistics
        const preparingOrders = await Order.countDocuments({ orderStatus: 'preparing' })
        const confirmedOrders = await Order.countDocuments({ orderStatus: 'confirmed' })

        // Calculate estimated wait time (in minutes)
        // Assuming average preparation time of 8 minutes per order
        const avgPrepTime = 8
        const queueLength = preparingOrders + confirmedOrders
        const estimatedWaitTime = queueLength * avgPrepTime

        // Get recent completion times for better estimates
        const recentCompletedOrders = await Order.find({
            orderStatus: 'completed',
            updatedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
        }).sort({ updatedAt: -1 }).limit(10)

        return NextResponse.json({
            success: true,
            queueStats: {
                preparingOrders,
                confirmedOrders,
                totalInQueue: queueLength,
                estimatedWaitTime,
                avgPrepTime
            },
            recentCompletions: recentCompletedOrders.length
        })

    } catch (error) {
        console.error('Estimate calculation error:', error)
        return NextResponse.json(
            { success: false, message: 'Failed to calculate estimates' },
            { status: 500 }
        )
    }
}