import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import MenuItem from '@/models/MenuItem'
import jwt from 'jsonwebtoken'

function checkAdmin(request) {
    const token = request.cookies.get('admin-token')?.value
    if (!token) throw new Error('Unauthorized')
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-here')
    if (decoded.role !== 'admin') throw new Error('Unauthorized')
    return decoded
}

// Public — fetch menu by category
export async function GET(request) {
    try {
        await connectDB()
        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category')
        const query = { available: true }
        if (category) query.category = category
        const items = await MenuItem.find(query).sort({ createdAt: 1 })
        return NextResponse.json({ success: true, items })
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to fetch menu' }, { status: 500 })
    }
}

// Admin — add item
export async function POST(request) {
    try {
        checkAdmin(request)
        await connectDB()
        const body = await request.json()
        const item = await MenuItem.create(body)
        return NextResponse.json({ success: true, item }, { status: 201 })
    } catch (error) {
        if (error.message === 'Unauthorized')
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }
}

// Admin — edit item
export async function PUT(request) {
    try {
        checkAdmin(request)
        await connectDB()
        const body = await request.json()
        const { _id, ...update } = body
        const item = await MenuItem.findByIdAndUpdate(_id, update, { new: true, runValidators: true })
        if (!item) return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 })
        return NextResponse.json({ success: true, item })
    } catch (error) {
        if (error.message === 'Unauthorized')
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }
}

// Admin — delete item
export async function DELETE(request) {
    try {
        checkAdmin(request)
        await connectDB()
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        await MenuItem.findByIdAndDelete(id)
        return NextResponse.json({ success: true })
    } catch (error) {
        if (error.message === 'Unauthorized')
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }
}
