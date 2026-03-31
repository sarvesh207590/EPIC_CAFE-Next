import jwt from 'jsonwebtoken'

export function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-here')
        return { success: true, decoded }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

export function extractTokenFromRequest(request) {
    // Try to get token from cookie first
    const tokenFromCookie = request.cookies.get('token')?.value

    if (tokenFromCookie) {
        return tokenFromCookie
    }

    // Fallback to Authorization header
    const authHeader = request.headers.get('authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7)
    }

    return null
}

export function requireAuth(handler) {
    return async (request) => {
        const token = extractTokenFromRequest(request)

        if (!token) {
            return new Response(
                JSON.stringify({ success: false, message: 'Authentication required' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            )
        }

        const { success, decoded, error } = verifyToken(token)

        if (!success) {
            return new Response(
                JSON.stringify({ success: false, message: 'Invalid token', error }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            )
        }

        // Add user info to request
        request.user = decoded

        return handler(request)
    }
}