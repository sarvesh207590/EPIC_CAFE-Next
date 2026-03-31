import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export async function POST(request) {
    try {
        await connectDB()

        const body = await request.json()
        const { username, email, password } = body

        // Check if user already exists
        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return NextResponse.json(
                { success: false, message: 'Email already exists' },
                { status: 409 }
            )
        }

        // Hash password
        const saltRounds = 12
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        // Create new user
        const user = new User({
            username,
            email,
            password: hashedPassword
        })

        const savedUser = await user.save()

        return NextResponse.json({
            success: true,
            message: 'Signup successful! Please login.',
            userId: savedUser._id
        })

    } catch (error) {
        console.error('Signup error:', error)

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message)
            return NextResponse.json(
                { success: false, message: 'Validation error', errors },
                { status: 400 }
            )
        }

        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, message: 'Email already exists' },
                { status: 409 }
            )
        }

        return NextResponse.json(
            { success: false, message: 'Signup failed' },
            { status: 500 }
        )
    }
}