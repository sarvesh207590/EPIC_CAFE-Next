/**
 * Setup script to create admin user
 * Run this once: node setup-admin.js
 */

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env.local')
    process.exit(1)
}

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
})

const User = mongoose.models.User || mongoose.model('User', UserSchema)

async function setupAdmin() {
    try {
        console.log('🔌 Connecting to MongoDB...')
        await mongoose.connect(MONGODB_URI)
        console.log('✅ Connected to MongoDB')

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@gmail.com' })

        if (existingAdmin) {
            console.log('ℹ️  Admin user already exists')
            console.log('📧 Email: admin@gmail.com')
            console.log('🔑 Password: admin123')

            // Update password if needed
            const hashedPassword = await bcrypt.hash('admin123', 10)
            existingAdmin.password = hashedPassword
            await existingAdmin.save()
            console.log('✅ Admin password updated')
        } else {
            // Create new admin user
            const hashedPassword = await bcrypt.hash('admin123', 10)

            const admin = new User({
                username: 'admin',
                email: 'admin@gmail.com',
                password: hashedPassword
            })

            await admin.save()
            console.log('✅ Admin user created successfully!')
            console.log('📧 Email: admin@gmail.com')
            console.log('🔑 Password: admin123')
        }

        console.log('\n⚠️  IMPORTANT: Change the admin password after first login!')

    } catch (error) {
        console.error('❌ Error:', error.message)
    } finally {
        await mongoose.connection.close()
        console.log('🔌 Database connection closed')
        process.exit(0)
    }
}

setupAdmin()
