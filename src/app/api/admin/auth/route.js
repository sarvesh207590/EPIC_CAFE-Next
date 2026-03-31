import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(request) {
    try {
        const token = request.cookies.get('admin-token')?.value

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'No token provided' },
                { status: 401 }
            )
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-here')

        if (decoded.role !== 'admin') {
            return NextResponse.json(
                { success: false, message: 'Not authorized as admin' },
                { status: 403 }
            )
        }

        return NextResponse.json({
            success: true,
            user: {
                id: decoded.userId,
                email: decoded.email,
                role: decoded.role
            }
        })

    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Invalid token' },
            { status: 401 }
        )
    }
}