import mongoose from 'mongoose'

const TransactionSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        required: [true, 'Please provide a transaction ID'],
        match: [/^[0-9]{12}$/, 'Transaction ID must be 12 digits'],
        unique: true,
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: false,
    },
    amount: {
        type: Number,
        required: false,
        min: [0, 'Amount cannot be negative'],
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'completed',
    },
}, {
    timestamps: true,
})

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema)