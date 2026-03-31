import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request) {
    try {
        await connectDB()

        const body = await request.json()
        const { email, password } = body

        // Find user by email
        const user = await User.findOne({ email })

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Invalid credentials' },
                { status: 401 }
            )
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: 'Invalid credentials' },
                { status: 401 }
            )
        }

        // Check if user is admin (you can modify this logic)
        const isAdmin = user.email === 'admin@epiccafe.com' || user.username === 'admin'

        if (!isAdmin) {
            return NextResponse.json(
                { success: false, message: 'Not authorized as admin' },
                { status: 403 }
            )
        }

        // Create JWT token with admin role
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                username: user.username,
                role: 'admin'
            },
            process.env.JWT_SECRET || 'your-secret-key-here',
            { expiresIn: '24h' }
        )

        const response = NextResponse.json({
            success: true,
            message: 'Admin login successful',
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                role: 'admin'
            }
        })

        // Set HTTP-only cookie for admin
        response.cookies.set('admin-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400 // 24 hours
        })

        return response

    } catch (error) {
        console.error('Admin login error:', error)
        return NextResponse.json(
            { success: false, message: 'Login failed' },
            { status: 500 }
        )
    }
}