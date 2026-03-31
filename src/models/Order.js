import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema({
    foodItem: {
        type: String,
        required: [true, 'Please provide a food item'],
        maxlength: [100, 'Food item name cannot be more than 100 characters'],
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
        min: [0, 'Price cannot be negative'],
    },
    quantity: {
        type: Number,
        required: [true, 'Please provide quantity'],
        min: [1, 'Quantity must be at least 1'],
        default: 1,
    },
    totalPrice: {
        type: Number,
        required: [true, 'Please provide total price'],
        min: [0, 'Total price cannot be negative'],
    },
    customerName: {
        type: String,
        required: [true, 'Please provide customer name'],
        maxlength: [100, 'Customer name cannot be more than 100 characters'],
    },
    contact: {
        type: String,
        required: [true, 'Please provide contact number'],
        match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit contact number'],
    },
    status: {
        type: String,
        required: [true, 'Please provide status'],
        enum: ['student', 'faculty', 'other'],
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
        default: 'pending',
    },
}, {
    timestamps: true,
})

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)