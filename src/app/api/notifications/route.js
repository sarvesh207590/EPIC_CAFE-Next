import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'

export async function POST(request) {
    try {
        await connectDB()

        const body = await request.json()
        const { orderId, status, customerContact } = body

        // Find the order
        const order = await Order.findById(orderId)

        if (!order) {
            return NextResponse.json(
                { success: false, message: 'Order not found' },
                { status: 404 }
            )
        }

        // Generate notification message based on status
        const getNotificationMessage = (status, orderDetails) => {
            const messages = {
                confirmed: `Your order for ${orderDetails.foodItem} has been confirmed! Order #${orderDetails._id.toString().slice(-6)}`,
                preparing: `Good news! Your ${orderDetails.foodItem} is now being prepared. Order #${orderDetails._id.toString().slice(-6)}`,
                ready: `🔔 Your order is ready for pickup! Please collect your ${orderDetails.foodItem} from the counter. Order #${orderDetails._id.toString().slice(-6)}`,
                completed: `Thank you for visiting Epic Cafe! Your order for ${orderDetails.foodItem} is complete. We hope you enjoyed your meal! 😊`,
                cancelled: `We're sorry, but your order for ${orderDetails.foodItem} has been cancelled. Please contact us for more information.`
            }
            return messages[status] || `Your order status has been updated to ${status}`
        }

        const message = getNotificationMessage(status, order)

        // In a real application, you would send this via SMS, email, or push notification
        // For now, we'll just return the message that would be sent

        return NextResponse.json({
            success: true,
            message: 'Notification sent successfully',
            notificationMessage: message,
            orderDetails: {
                orderId: order._id,
                customerName: order.customerName,
                contact: order.contact,
                foodItem: order.foodItem,
                status: status
            }
        })

    } catch (error) {
        console.error('Notification error:', error)
        return NextResponse.json(
            { success: false, message: 'Failed to send notification' },
            { status: 500 }
        )
    }
}