import mongoose from 'mongoose'

const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        maxlength: [100, 'Email cannot be more than 100 characters'],
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    message: {
        type: String,
        required: [true, 'Please provide a message'],
        maxlength: [1000, 'Message cannot be more than 1000 characters'],
    },
    status: {
        type: String,
        enum: ['unread', 'read', 'replied'],
        default: 'unread',
    },
}, {
    timestamps: true,
})

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema)