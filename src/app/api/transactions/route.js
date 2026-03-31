import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Transaction from '@/models/Transaction'

export async function POST(request) {
    try {
        await connectDB()

        const body = await request.json()
        const { transactionId, orderId, amount } = body

        // Create new transaction
        const transaction = new Transaction({
            transactionId,
            orderId: orderId || null,
            amount: amount || null,
            status: 'completed'
        })

        const savedTransaction = await transaction.save()

        return NextResponse.json({
            success: true,
            message: 'Transaction recorded successfully',
            transactionId: savedTransaction._id,
            transaction: savedTransaction
        })

    } catch (error) {
        console.error('Transaction error:', error)

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message)
            return NextResponse.json(
                { success: false, message: 'Validation error', errors },
                { status: 400 }
            )
        }

        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, message: 'Transaction ID already exists' },
                { status: 409 }
            )
        }

        return NextResponse.json(
            { success: false, message: 'Failed to record transaction' },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        await connectDB()

        // Get the latest transaction
        const transaction = await Transaction.findOne().sort({ createdAt: -1 })

        if (!transaction) {
            return NextResponse.json(
                { success: false, message: 'No transactions found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ success: true, transaction })
    } catch (error) {
        console.error('Database error:', error)
        return NextResponse.json(
            { success: false, message: 'Failed to fetch transaction' },
            { status: 500 }
        )
    }
}