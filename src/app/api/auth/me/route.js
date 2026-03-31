import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(request) {
    try {
        const token = request.cookies.get('token')?.value
        if (!token) return NextResponse.json({ success: false }, { status: 401 })

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-here')
        return NextResponse.json({
            success: true,
            user: { id: decoded.userId, email: decoded.email, username: decoded.username }
        })
    } catch {
        return NextResponse.json({ success: false }, { status: 401 })
    }
}
