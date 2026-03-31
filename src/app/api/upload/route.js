import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import jwt from 'jsonwebtoken'

function checkAdmin(request) {
    const token = request.cookies.get('admin-token')?.value
    if (!token) throw new Error('Unauthorized')
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-here')
    if (decoded.role !== 'admin') throw new Error('Unauthorized')
}

export async function POST(request) {
    try {
        checkAdmin(request)

        const formData = await request.formData()
        const file = formData.get('file')

        if (!file || typeof file === 'string') {
            return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 })
        }

        // Validate type
        const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!allowed.includes(file.type)) {
            return NextResponse.json({ success: false, message: 'Only JPG, PNG, WEBP allowed' }, { status: 400 })
        }

        // Validate size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            return NextResponse.json({ success: false, message: 'File too large. Max 2MB.' }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Sanitise filename and make unique
        const ext = file.name.split('.').pop().toLowerCase()
        const base = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase()
        const filename = `${base}_${Date.now()}.${ext}`

        const uploadDir = join(process.cwd(), 'public', 'img')
        await mkdir(uploadDir, { recursive: true })
        await writeFile(join(uploadDir, filename), buffer)

        return NextResponse.json({ success: true, path: `/img/${filename}` })
    } catch (error) {
        if (error.message === 'Unauthorized')
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        console.error('Upload error:', error)
        return NextResponse.json({ success: false, message: 'Upload failed' }, { status: 500 })
    }
}
