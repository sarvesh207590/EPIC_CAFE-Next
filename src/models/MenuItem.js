import mongoose from 'mongoose'

const MenuItemSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 100 },
    category: { type: String, required: true, enum: ['snacks', 'beverages', 'meal'] },
    image: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    unit: { type: String, default: '' },
    available: { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.models.MenuItem || mongoose.model('MenuItem', MenuItemSchema)
